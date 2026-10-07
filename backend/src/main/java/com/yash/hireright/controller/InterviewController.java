package com.yash.hireright.controller;

import com.yash.hireright.dto.InterviewRequest;
import com.yash.hireright.dto.InterviewResponse;
import com.yash.hireright.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications/{applicationId}/interview")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @PathVariable Long applicationId,
            @Valid @RequestBody InterviewRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.scheduleInterview(
                        applicationId, request, authentication
                )
        );
    }

    @PreAuthorize("hasAnyRole('CANDIDATE', 'RECRUITER')")
    @GetMapping
    public ResponseEntity<InterviewResponse> getInterview(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.getInterviewForApplication(
                        applicationId, authentication
                )
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping
    public ResponseEntity<Void> deleteInterview(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        interviewService.deleteInterview(applicationId, authentication);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PatchMapping("/complete")
    public ResponseEntity<InterviewResponse> markCompleted(
            @PathVariable Long applicationId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.markCompleted(applicationId, authentication)
        );
    }
}