package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private String employmentType;
    private String experienceLevel;
    private LocalDateTime createdAt;

    public JobResponse() {
    }
}