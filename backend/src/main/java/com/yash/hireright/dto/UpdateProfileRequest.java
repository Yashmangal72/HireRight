package com.yash.hireright.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String phone;

    @Size(max = 1000, message = "Bio must be under 1000 characters")
    private String bio;

    private String location;

    private String skills;

    private String companyName;

    private String companyWebsite;

    public UpdateProfileRequest() {
    }
}