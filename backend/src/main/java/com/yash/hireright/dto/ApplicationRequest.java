package com.yash.hireright.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    public ApplicationRequest() {
    }

}