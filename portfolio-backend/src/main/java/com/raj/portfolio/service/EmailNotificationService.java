package com.raj.portfolio.service;

import com.raj.portfolio.entity.Contact;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${portfolio.contact.notification-email}")
    private String notificationEmail;

    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactNotification(Contact contact) {

        if (notificationEmail == null || notificationEmail.isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(mailUsername);
        message.setTo(notificationEmail);

        if (contact.getEmail() != null && !contact.getEmail().isBlank()) {
            message.setReplyTo(contact.getEmail());
        }

        String subject = contact.getSubject();

        if (subject == null || subject.isBlank()) {
            subject = "New Portfolio Contact Message";
        } else {
            subject = "New Portfolio Contact: " + subject;
        }

        message.setSubject(subject);

        message.setText(
                "You received a new message through your portfolio website.\n\n"
                        + "Name: " + contact.getName() + "\n"
                        + "Email: " + contact.getEmail() + "\n"
                        + "Subject: " + (
                        contact.getSubject() == null ? "" : contact.getSubject()
                ) + "\n\n"
                        + "Message:\n"
                        + contact.getMessage()
        );

        mailSender.send(message);
    }
}