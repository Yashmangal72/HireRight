package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CandidateDetailResponse {

    private Long candidateId;
    private String name;
    private String email;
    private String phone;
    private String bio;
    private String location;
    private String skills;
    private boolean hasResume;
    private String resumeFilename;
    private List<ApplicationResponse> applications;

    public CandidateDetailResponse() {
    }
}