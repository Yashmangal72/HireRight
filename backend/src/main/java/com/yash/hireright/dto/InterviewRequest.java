package com.yash.hireright.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InterviewRequest {

    @NotNull(message = "Scheduled date/time is required")
    @Future(message = "Interview must be scheduled in the future")
    private LocalDateTime scheduledAt;

    @NotBlank(message = "Interview type is required")
    private String interviewType;

    private Integer durationMinutes;

    private String meetingLink;

    private String notes;

    public InterviewRequest() {
    }
}