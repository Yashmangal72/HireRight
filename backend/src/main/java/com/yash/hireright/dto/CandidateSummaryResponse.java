package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CandidateSummaryResponse {

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String skills;
    private String location;
    private Long latestApplicationId;
    private String latestJobTitle;
    private String latestStatus;
    private LocalDateTime latestAppliedAt;
    private int totalApplications;

    public CandidateSummaryResponse() {
    }
}