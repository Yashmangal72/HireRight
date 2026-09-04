package com.yash.hireright.controller;

import com.yash.hireright.dto.*;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.UnauthorizedException;
import com.yash.hireright.repository.UserRepository;
import com.yash.hireright.security.JwtService;
import com.yash.hireright.service.OtpService;
import com.yash.hireright.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final OtpService otpService;

    public AuthController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            OtpService otpService
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    // Step 1: Send OTP to email
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        otpService.sendOtp(request.getEmail());

        return ResponseEntity.ok(
                Map.of("message", "OTP sent to " + request.getEmail())
        );
    }

    // Step 2: Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!valid) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid or expired OTP"));
        }

        return ResponseEntity.ok(
                Map.of("message", "OTP verified successfully")
        );
    }

    // Step 3: Register (only after OTP verified)
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        // Re-verify OTP is still valid before creating account
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            throw new UnauthorizedException(
                    "OTP verification required before registration"
            );
        }

        User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        // Clear OTP after successful registration
        otpService.clearOtp(request.getEmail());

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(token);
    }
}