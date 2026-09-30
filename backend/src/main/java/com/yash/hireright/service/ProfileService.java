package com.yash.hireright.service;

import com.yash.hireright.dto.UpdateProfileRequest;
import com.yash.hireright.dto.UserProfileResponse;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.UserNotFoundException;
import com.yash.hireright.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return mapToResponse(user);
    }

    public UserProfileResponse updateMyProfile(
            UpdateProfileRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        user.setLocation(request.getLocation());
        user.setSkills(request.getSkills());
        user.setCompanyName(request.getCompanyName());
        user.setCompanyWebsite(request.getCompanyWebsite());

        User saved = userRepository.save(user);

        return mapToResponse(saved);
    }

    public void deleteMyAccount(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        userRepository.delete(user);
    }

    private UserProfileResponse mapToResponse(User user) {

        UserProfileResponse response = new UserProfileResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPhone(user.getPhone());
        response.setBio(user.getBio());
        response.setLocation(user.getLocation());
        response.setSkills(user.getSkills());
        response.setCompanyName(user.getCompanyName());
        response.setCompanyWebsite(user.getCompanyWebsite());

        return response;
    }
}