package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SavedJobResponse {

    private Long savedJobId;
    private JobResponse job;

    public SavedJobResponse() {
    }

    public SavedJobResponse(Long savedJobId, JobResponse job) {
        this.savedJobId = savedJobId;
        this.job = job;
    }
}