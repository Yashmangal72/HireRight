package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecruiterDashboardResponse {

    private long jobsCount;
    private long applicationsCount;
    private long shortlistedCount;
    private long hiredCount;
    private List<ApplicationResponse> recentApplications;

    public RecruiterDashboardResponse() {
    }
}