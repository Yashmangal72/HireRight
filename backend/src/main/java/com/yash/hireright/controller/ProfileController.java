package com.yash.hireright.controller;

import com.yash.hireright.dto.UpdateProfileRequest;
import com.yash.hireright.dto.UserProfileResponse;
import com.yash.hireright.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                profileService.getMyProfile(authentication)
        );
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                profileService.updateMyProfile(request, authentication)
        );
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteMyAccount(
            Authentication authentication
    ) {
        profileService.deleteMyAccount(authentication);
        return ResponseEntity.noContent().build();
    }
}