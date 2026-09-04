package com.yash.hireright.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private final OtpStore otpStore;
    private final JavaMailSender mailSender;

    public OtpService(OtpStore otpStore, JavaMailSender mailSender) {
        this.otpStore = otpStore;
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {
        String otp = generateOtp();

        otpStore.save(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("HireRight — Your verification code");
        message.setText(
            "Hi,\n\n" +
            "Your HireRight verification code is:\n\n" +
            "    " + otp + "\n\n" +
            "This code expires in 10 minutes.\n" +
            "If you didn't request this, you can safely ignore this email.\n\n" +
            "— HireRight Team"
        );

        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        return otpStore.verify(email, otp);
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
