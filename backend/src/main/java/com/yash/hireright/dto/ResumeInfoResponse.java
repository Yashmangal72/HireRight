package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResumeInfoResponse {

    private boolean hasResume;
    private String filename;

    public ResumeInfoResponse() {
    }

    public ResumeInfoResponse(boolean hasResume, String filename) {
        this.hasResume = hasResume;
        this.filename = filename;
    }
}