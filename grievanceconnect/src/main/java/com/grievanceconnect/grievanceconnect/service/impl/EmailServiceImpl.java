package com.grievanceconnect.grievanceconnect.service.impl;

import com.grievanceconnect.grievanceconnect.service.EmailService;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from.email}")
    private String fromEmail;

    private void sendEmail(String to, String subject, String html) {
        try {
            Resend resend = new Resend(apiKey);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(to)
                    .subject(subject)
                    .html(html)
                    .build();

            resend.emails().send(params);

        } catch (Exception e) {
            System.out.println("Email sending failed: " + e.getMessage());
            String msg = e.getMessage();
            if (msg != null && msg.contains("You can only send testing emails to your own email address")) {
                try {
                    int start = msg.indexOf("own email address (") + "own email address (".length();
                    int end = msg.indexOf(")", start);
                    if (start > 0 && end > start) {
                        String ownerEmail = msg.substring(start, end);
                        System.out.println("Sandbox mode: Redirecting email to owner: " + ownerEmail);

                        Resend resendFallback = new Resend(apiKey);
                        CreateEmailOptions fallbackParams = CreateEmailOptions.builder()
                                .from(fromEmail)
                                .to(ownerEmail)
                                .subject("[Sandbox to: " + to + "] " + subject)
                                .html("<h3>Original Recipient: " + to + "</h3><hr>" + html)
                                .build();
                        resendFallback.emails().send(fallbackParams);
                    }
                } catch (Exception ex) {
                    System.out.println("Fallback email sending failed: " + ex.getMessage());
                }
            }
        }
    }

    @Override
    public void sendGrievanceSubmittedEmail(
            String studentEmail,
            String studentName,
            String title,
            String description) {

        String html = """
            <div style='font-family:Arial,sans-serif;padding:20px'>
                <h2 style='color:#2563eb'>Grievance Submitted Successfully ✅</h2>

                <p>Hello <b>%s</b>,</p>
                <p>Your grievance has been submitted successfully and is now under review.</p>

                <hr>

                <p><b>Grievance Title:</b> %s</p>
                <p><b>Description:</b> %s</p>
                <p><b>Status:</b> OPEN</p>

                <hr>

                <p>We will notify you whenever the status changes.</p>

                <br>
                <p>Regards,</p>
                <p><b>GrievanceConnect Team</b></p>
            </div>
            """.formatted(studentName, title, description);

        sendEmail(studentEmail, "Grievance Submitted Successfully", html);
    }
    @Override
    public void sendGrievanceEscalatedEmail(
            String receiverEmail,
            String receiverName,
            String title) {

        String html = """
                <div style='font-family:Arial,sans-serif;padding:20px'>
                    <h2 style='color:#f59e0b'>
                        Grievance Escalated 📌
                    </h2>

                    <p>Hello <b>%s</b>,</p>

                    <p>
                        A grievance has been escalated and requires your attention.
                    </p>

                    <hr>

                    <p><b>Grievance Title:</b> %s</p>

                    <hr>

                    <p>
                        Please review and take necessary action.
                    </p>

                    <br>

                    <p>Regards,</p>
                    <p><b>GrievanceConnect Team</b></p>
                </div>
                """.formatted(receiverName, title);

        sendEmail(
                receiverEmail,
                "Grievance Escalated",
                html
        );
    }



    @Override
    public void sendGrievanceResolvedEmail(
            String studentEmail,
            String studentName,
            String title) {

        String html = """
                <div style='font-family:Arial,sans-serif;padding:20px'>
                    <h2 style='color:#16a34a'>
                        Grievance Resolved 🎉
                    </h2>

                    <p>Hello <b>%s</b>,</p>

                    <p>
                        Your grievance has been resolved successfully.
                    </p>

                    <hr>

                    <p><b>Grievance Title:</b> %s</p>
                    
                    <p><b>Status:</b> RESOLVED</p>

                    <hr>

                    <p>
                        Thank you for your patience and for using GrievanceConnect.
                    </p>

                    <br>

                    <p>Regards,</p>
                    <p><b>GrievanceConnect Team</b></p>
                </div>
                """.formatted(studentName, title);

        sendEmail(
                studentEmail,
                "Your Grievance Has Been Resolved",
                html
        );
    }
    @Override
    public void sendStaffNotification(String staffEmail, String title, String description) {
        String html = """
            <div style='font-family:Arial,sans-serif;padding:20px'>
                <h2 style='color:#2563eb'>New Grievance Assigned 📩</h2>
                <p>A new grievance has been submitted in your department.</p>
                <hr>
                <p><b>Title:</b> %s</p>
                <p><b>Description:</b> %s</p>
                <p><b>Status:</b> OPEN</p>
                <hr>
                <p>Please login to GrievanceConnect and review it.</p>
                <p><b>GrievanceConnect Team</b></p>
            </div>
            """.formatted(title, description);

        sendEmail(staffEmail, "New Grievance Assigned", html);
    }

    @Override
    public void sendHodNotification(String hodEmail, String title, String description) {
        String html = """
            <div style='font-family:Arial,sans-serif;padding:20px'>
                <h2 style='color:#f59e0b'>Grievance Escalated to HOD 📌</h2>
                <p>A grievance has been escalated to you for further action.</p>
                <hr>
                <p><b>Title:</b> %s</p>
                <p><b>Description:</b> %s</p>
                <p><b>Status:</b> ESCALATED TO HOD</p>
                <hr>
                <p>Please login to GrievanceConnect and take necessary action.</p>
                <p><b>GrievanceConnect Team</b></p>
            </div>
            """.formatted(title, description);

        sendEmail(hodEmail, "Grievance Escalated to HOD", html);
    }

    @Override
    public void sendPrincipalNotification(String principalEmail, String title, String description) {
        String html = """
            <div style='font-family:Arial,sans-serif;padding:20px'>
                <h2 style='color:#dc2626'>Grievance Escalated to Principal 🚨</h2>
                <p>A grievance has been escalated to principal level.</p>
                <hr>
                <p><b>Title:</b> %s</p>
                <p><b>Description:</b> %s</p>
                <p><b>Status:</b> ESCALATED TO PRINCIPAL</p>
                <hr>
                <p>Please login to GrievanceConnect and review it.</p>
                <p><b>GrievanceConnect Team</b></p>
            </div>
            """.formatted(title, description);

        sendEmail(principalEmail, "Grievance Escalated to Principal", html);
    }
}