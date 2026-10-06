package com.yash.hireright.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateNoteRequest {

    @NotBlank(message = "Note content is required")
    private String content;

    public CandidateNoteRequest() {
    }
}