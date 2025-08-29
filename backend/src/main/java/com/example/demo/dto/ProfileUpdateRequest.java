package com.example.demo.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    // Client fields
    private String clientName;
    private String company;
    private String phone;

    // Freelancer fields
    private String name;
    private String skills;
    private Double hourlyRate;
    private String bio;
}


