package com.yash.hireright.dto;

import com.yash.hireright.entity.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApplicationStatusRequest {

    private ApplicationStatus status;

}