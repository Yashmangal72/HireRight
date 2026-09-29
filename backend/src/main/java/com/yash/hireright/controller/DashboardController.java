package com.yash.hireright.controller;

import com.yash.hireright.dto.CandidateDashboardResponse;
import com.yash.hireright.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate")
    public ResponseEntity<CandidateDashboardResponse> getCandidateDashboard(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                dashboardService.getCandidateDashboard(authentication)
        );
    }
}