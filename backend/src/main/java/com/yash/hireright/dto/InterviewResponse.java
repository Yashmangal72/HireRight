package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InterviewResponse {

    private Long id;
    private Long applicationId;
    private String jobTitle;
    private String candidateName;
    private LocalDateTime scheduledAt;
    private String interviewType;
    private Integer durationMinutes;
    private String meetingLink;
    private String notes;

    public InterviewResponse() {
    }
}