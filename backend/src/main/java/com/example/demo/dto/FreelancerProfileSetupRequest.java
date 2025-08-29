package com.example.demo.dto;

import lombok.Data;

@Data
public class FreelancerProfileSetupRequest {
    private String name;
    private String skills;
    private Double hourlyRate;
    private String bio;
}


