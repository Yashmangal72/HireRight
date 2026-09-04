package com.yash.hireright.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private record OtpEntry(String otp, LocalDateTime expiresAt) {}

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public void save(String email, String otp) {
        store.put(
            email.toLowerCase(),
            new OtpEntry(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
        );
    }

    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());

        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiresAt())) {
            store.remove(email.toLowerCase());
            return false;
        }

        return entry.otp().equals(otp);
    }

    public void remove(String email) {
        store.remove(email.toLowerCase());
    }
}
