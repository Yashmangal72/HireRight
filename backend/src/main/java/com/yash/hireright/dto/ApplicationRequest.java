package com.yash.hireright.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @Size(max = 2000, message = "Cover letter must be under 2000 characters")
    private String coverLetter;

    public ApplicationRequest() {
    }

}