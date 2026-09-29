package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CandidateDashboardResponse {

    private long applicationsCount;
    private long interviewsCount;
    private long hiredCount;
    private List<ApplicationResponse> recentApplications;
    private List<JobResponse> recommendedJobs;

    public CandidateDashboardResponse() {
    }
}