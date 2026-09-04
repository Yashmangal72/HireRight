package com.yash.hireright.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private final OtpStore otpStore;
    private final Resend resend;

    public OtpService(
            OtpStore otpStore,
            @Value("${resend.api.key}") String apiKey
    ) {
        this.otpStore = otpStore;
        this.resend = new Resend(apiKey);
    }

    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStore.save(email, otp);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("HireRight <onboarding@resend.dev>")
                .to(email)
                .subject("HireRight — Your verification code")
                .text(
                        "Hi,\n\n" +
                                "Your HireRight verification code is:\n\n" +
                                "    " + otp + "\n\n" +
                                "This code expires in 10 minutes.\n" +
                                "If you didn't request this, you can safely ignore this email.\n\n" +
                                "— HireRight Team"
                )
                .build();

        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
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