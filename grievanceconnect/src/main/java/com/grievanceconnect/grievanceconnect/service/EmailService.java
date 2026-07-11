package com.grievanceconnect.grievanceconnect.service;

public interface EmailService {
    void sendGrievanceSubmittedEmail(
            String studentEmail,
            String studentName,
            String title,
            String description
    );
    void sendGrievanceEscalatedEmail(String receiverEmail, String receiverName, String title);
    void sendGrievanceResolvedEmail(String studentEmail, String studentName, String title);
    void sendStaffNotification(String staffEmail, String title, String description);

    void sendHodNotification(String hodEmail, String title, String description);

    void sendPrincipalNotification(String principalEmail, String title, String description);
}