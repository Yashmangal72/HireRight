package com.yash.hireright.controller;

import com.yash.hireright.dto.ApplicationRequest;
import com.yash.hireright.dto.ApplicationResponse;
import com.yash.hireright.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.yash.hireright.dto.ApplicationStatusRequest;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping
    public ResponseEntity<ApplicationResponse> applyForJob(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication
    ) {

        ApplicationResponse response =
                applicationService.applyForJob(
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications(
            Authentication authentication
    ) {

        List<ApplicationResponse> applications =
                applicationService.getAllApplications(authentication);

        return ResponseEntity.ok(applications);
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        List<ApplicationResponse> applications =
                applicationService.getMyApplications(authentication);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'RECRUITER')")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getApplication(id, authentication)
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody ApplicationStatusRequest request,
            Authentication authentication
    ) {

        ApplicationResponse response =
                applicationService.updateStatus(
                        id,
                        request.getStatus(),
                        authentication
                );

        return ResponseEntity.ok(response);
    }
}