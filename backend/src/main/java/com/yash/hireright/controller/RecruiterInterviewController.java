package com.yash.hireright.controller;

import com.yash.hireright.dto.InterviewResponse;
import com.yash.hireright.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/interviews")
public class RecruiterInterviewController {

    private final InterviewService interviewService;

    public RecruiterInterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getMyInterviews(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.getMyScheduledInterviews(authentication)
        );
    }
}