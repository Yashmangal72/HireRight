package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CandidateNoteResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;

    public CandidateNoteResponse() {
    }
}