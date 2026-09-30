package com.yash.hireright.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String bio;
    private String location;
    private String skills;
    private String companyName;
    private String companyWebsite;

    public UserProfileResponse() {
    }
}