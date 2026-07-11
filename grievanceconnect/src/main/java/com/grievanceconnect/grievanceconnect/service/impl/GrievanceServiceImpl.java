package com.grievanceconnect.grievanceconnect.service.impl;
import com.grievanceconnect.grievanceconnect.dto.response.GrievanceHistoryResponse;
import com.grievanceconnect.grievanceconnect.dto.request.CreateGrievanceRequest;
import com.grievanceconnect.grievanceconnect.dto.response.GrievanceResponse;
import com.grievanceconnect.grievanceconnect.entity.*;
import com.grievanceconnect.grievanceconnect.enums.GrievanceCategory;
import com.grievanceconnect.grievanceconnect.enums.GrievanceStatus;
import com.grievanceconnect.grievanceconnect.repository.GrievanceHistoryRepository;
import com.grievanceconnect.grievanceconnect.repository.GrievanceRepository;
import com.grievanceconnect.grievanceconnect.repository.UserRepository;
import com.grievanceconnect.grievanceconnect.service.EmailService;
import com.grievanceconnect.grievanceconnect.service.GrievanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.grievanceconnect.grievanceconnect.repository.NotificationRepository;
import com.grievanceconnect.grievanceconnect.dto.response.NotificationResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import com.grievanceconnect.grievanceconnect.service.EmailService;
@Service
@RequiredArgsConstructor
public class GrievanceServiceImpl implements GrievanceService {
    private final EmailService emailService;
    private final GrievanceRepository grievanceRepository;
    private final UserRepository userRepository;
    private final GrievanceHistoryRepository grievanceHistoryRepository;
    private final NotificationRepository notificationRepository;
    @Override
    public GrievanceResponse createGrievance(CreateGrievanceRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User assignedStaff = null;
        if (request.getStaffId() != null) {
            assignedStaff = userRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Selected staff not found"));

            if (!assignedStaff.getRole().getRoleName().name().equals("STAFF")) {
                throw new RuntimeException("Selected user is not a staff");
            }
        }

        Grievance grievance = Grievance.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(GrievanceCategory.valueOf(request.getCategory().toUpperCase()))
                .anonymous(request.getAnonymous())
                .status(GrievanceStatus.OPEN)
                .createdBy(student)
                .department(student.getDepartment())
                .assignedStaff(assignedStaff)
                .build();

        if (!request.getAnonymous()) {
            grievance.setStudentName(student.getFullName());
        }

        Grievance saved = grievanceRepository.save(grievance);

        emailService.sendGrievanceSubmittedEmail(
                student.getEmail(),
                student.getFullName(),
                saved.getTitle(),
                saved.getDescription()
        );

        if (assignedStaff != null) {
            emailService.sendStaffNotification(
                    assignedStaff.getEmail(),
                    saved.getTitle(),
                    saved.getDescription()
            );
        }

        return mapToResponse(saved);
    }
    @Override
    public List<NotificationResponse> getNotifications(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .message(notification.getMessage())
                        .isRead(notification.getIsRead())
                        .createdAt(notification.getCreatedAt())
                        .grievanceId(notification.getGrievance().getId())
                        .build())
                .toList();
    }

    @Override
    public void markNotificationAsRead(Long notificationId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    @Override
    public List<GrievanceHistoryResponse> getGrievanceHistory(Long grievanceId) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        return grievanceHistoryRepository.findByGrievance(grievance)
                .stream()
                .map(history -> GrievanceHistoryResponse.builder()
                        .oldStatus(history.getOldStatus())
                        .newStatus(history.getNewStatus())
                        .remarks(history.getRemarks())
                        .changedBy(history.getChangedBy().getFullName())
                        .changedAt(history.getChangedAt())
                        .build())
                .toList();
    }
    @Override
    public List<GrievanceResponse> getMyGrievances(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return grievanceRepository.findByCreatedBy(student)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public GrievanceResponse getGrievanceById(Long id, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        if (!grievance.getCreatedBy().getId().equals(student.getId())) {
            throw new RuntimeException("You are not allowed to view this grievance");
        }

        return mapToResponse(grievance);
    }

    @Override
    public List<GrievanceResponse> getDepartmentGrievances(String staffEmail) {
        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        return grievanceRepository.findAll()
                .stream()
                .filter(g -> g.getDepartment().getId().equals(staff.getDepartment().getId()))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public GrievanceResponse markInProgress(Long grievanceId, String staffEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.IN_PROGRESS);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, staff, oldStatus, GrievanceStatus.IN_PROGRESS.name(),
                "Marked as In Progress");
        createNotification(
                saved.getCreatedBy(),
                saved,
                "Your grievance '" + saved.getTitle() + "' is now In Progress."
        );

        return mapToResponse(saved);
    }

    @Override
    public GrievanceResponse resolveGrievance(Long grievanceId, String staffEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.RESOLVED);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, staff, oldStatus, GrievanceStatus.RESOLVED.name(),
                "Resolved by Staff");
        createNotification(
                saved.getCreatedBy(),
                saved,
                "Your grievance '" + saved.getTitle() + "' has been resolved."
        );
        emailService.sendGrievanceResolvedEmail(
                saved.getCreatedBy().getEmail(),
                saved.getCreatedBy().getFullName(),
                saved.getTitle()
        );
        return mapToResponse(saved);
    }

    @Override
    public GrievanceResponse createGrievanceWithFile(
            String title,
            String description,
            String category,
            Boolean anonymous,
            String studentName,
            MultipartFile proofFile,
            Long staffId,
            String studentEmail
    ) throws IOException {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User assignedStaff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Selected staff not found"));

        if (!assignedStaff.getRole().getRoleName().name().equals("STAFF")) {
            throw new RuntimeException("Selected user is not a staff");
        }

        Grievance grievance = new Grievance();

        grievance.setTitle(title);
        grievance.setDescription(description);
        grievance.setCategory(GrievanceCategory.valueOf(category.toUpperCase()));
        grievance.setAnonymous(anonymous);
        grievance.setStatus(GrievanceStatus.OPEN);
        grievance.setCreatedBy(student);
        grievance.setDepartment(student.getDepartment());
        grievance.setAssignedStaff(assignedStaff);

        if (!anonymous) {
            grievance.setStudentName(studentName);
        }

        if (proofFile != null && !proofFile.isEmpty()) {
            String fileName =
                    System.currentTimeMillis() + "_" + proofFile.getOriginalFilename();

            Path uploadPath = Paths.get("uploads");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    proofFile.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            grievance.setProofFileName(fileName);
            grievance.setProofFilePath(filePath.toString());
        }

        Grievance saved = grievanceRepository.save(grievance);

        emailService.sendGrievanceSubmittedEmail(
                student.getEmail(),
                student.getFullName(),
                saved.getTitle(),
                saved.getDescription()
        );

        emailService.sendStaffNotification(
                assignedStaff.getEmail(),
                saved.getTitle(),
                saved.getDescription()
        );

        return mapToResponse(saved);
    }
    @Override
    public List<GrievanceResponse> getAllGrievances() {
        return grievanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public GrievanceResponse escalateToHod(Long grievanceId, String staffEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.ESCALATED_TO_HOD);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, staff, oldStatus, GrievanceStatus.ESCALATED_TO_HOD.name(),
                "Escalated to HOD");
        createNotification(
                saved.getCreatedBy(),
                saved,
                "Your grievance '" + saved.getTitle() + "' has been escalated to HOD."
        );
        User hod = userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getRole().getRoleName().name().equals("HOD")
                                && u.getDepartment() != null
                                && u.getDepartment().getId().equals(saved.getDepartment().getId())
                )
                .findFirst()
                .orElse(null);

        if (hod != null) {
            emailService.sendHodNotification(
                    hod.getEmail(),
                    saved.getTitle(),
                    saved.getDescription()
            );
        }
        return mapToResponse(saved);
    }

    @Override
    public List<GrievanceResponse> getHodGrievances(String hodEmail) {
        User hod = userRepository.findByEmail(hodEmail)
                .orElseThrow(() -> new RuntimeException("HOD not found"));

        return grievanceRepository.findAll()
                .stream()
                .filter(g -> g.getDepartment().getId().equals(hod.getDepartment().getId()))
                .filter(g -> g.getStatus() == GrievanceStatus.ESCALATED_TO_HOD)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public GrievanceResponse resolveByHod(Long grievanceId, String hodEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User hod = userRepository.findByEmail(hodEmail)
                .orElseThrow(() -> new RuntimeException("HOD not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.RESOLVED);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, hod, oldStatus, GrievanceStatus.RESOLVED.name(),
                "Resolved by HOD");
        emailService.sendGrievanceResolvedEmail(
                saved.getCreatedBy().getEmail(),
                saved.getCreatedBy().getFullName(),
                saved.getTitle()
        );
        return mapToResponse(saved);
    }

    @Override
    public GrievanceResponse escalateToPrincipal(Long grievanceId, String hodEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User hod = userRepository.findByEmail(hodEmail)
                .orElseThrow(() -> new RuntimeException("HOD not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.ESCALATED_TO_PRINCIPAL);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, hod, oldStatus, GrievanceStatus.ESCALATED_TO_PRINCIPAL.name(),
                "Escalated to Principal");
        User principal = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole().getRoleName().name().equals("PRINCIPAL"))
                .findFirst()
                .orElse(null);

        if (principal != null) {
            emailService.sendPrincipalNotification(
                    principal.getEmail(),
                    saved.getTitle(),
                    saved.getDescription()
            );
        }
        return mapToResponse(saved);
    }

    @Override
    public List<GrievanceResponse> getPrincipalGrievances(String principalEmail) {
        return grievanceRepository.findAll()
                .stream()
                .filter(g -> g.getStatus() == GrievanceStatus.ESCALATED_TO_PRINCIPAL)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public GrievanceResponse resolveByPrincipal(Long grievanceId, String principalEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User principal = userRepository.findByEmail(principalEmail)
                .orElseThrow(() -> new RuntimeException("Principal not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.RESOLVED);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, principal, oldStatus, GrievanceStatus.RESOLVED.name(),
                "Resolved by Principal");
        emailService.sendGrievanceResolvedEmail(
                saved.getCreatedBy().getEmail(),
                saved.getCreatedBy().getFullName(),
                saved.getTitle()
        );
        return mapToResponse(saved);
    }

    @Override
    public GrievanceResponse closeByPrincipal(Long grievanceId, String principalEmail) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        User principal = userRepository.findByEmail(principalEmail)
                .orElseThrow(() -> new RuntimeException("Principal not found"));

        String oldStatus = grievance.getStatus().name();

        grievance.setStatus(GrievanceStatus.CLOSED);
        Grievance saved = grievanceRepository.save(grievance);

        saveHistory(saved, principal, oldStatus, GrievanceStatus.CLOSED.name(),
                "Closed by Principal");

        return mapToResponse(saved);
    }

    private void saveHistory(
            Grievance grievance,
            User changedBy,
            String oldStatus,
            String newStatus,
            String remarks) {

        grievanceHistoryRepository.save(
                GrievanceHistory.builder()
                        .grievance(grievance)
                        .changedBy(changedBy)
                        .oldStatus(oldStatus)
                        .newStatus(newStatus)
                        .remarks(remarks)
                        .build()
        );
    }

    private GrievanceResponse mapToResponse(Grievance grievance) {
        return GrievanceResponse.builder()
                .id(grievance.getId())
                .title(grievance.getTitle())
                .description(grievance.getDescription())
                .category(grievance.getCategory().name())
                .status(grievance.getStatus().name())
                .anonymous(grievance.getAnonymous())

                .submittedBy(
                        grievance.getAnonymous()
                                ? "Anonymous"
                                : grievance.getCreatedBy().getFullName()
                )

                .studentName(grievance.getStudentName())
                .proofFileName(grievance.getProofFileName())
                .proofFilePath(grievance.getProofFilePath())

                .departmentName(
                        grievance.getDepartment() != null
                                ? grievance.getDepartment().getDepartmentName()
                                : null
                )

                .createdAt(grievance.getCreatedAt())
                .updatedAt(grievance.getUpdatedAt())
                .build();
    }
    private void createNotification(
            User user,
            Grievance grievance,
            String message) {

        notificationRepository.save(
                Notification.builder()
                        .user(user)
                        .grievance(grievance)
                        .message(message)
                        .isRead(false)
                        .build()
        );
    }
}