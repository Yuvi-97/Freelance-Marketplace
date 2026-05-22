package com.example.demo.dto;

import lombok.Data;

@Data
public class FreelancerProfileSetupRequest {
    private String name;
    private String professionalHeadline;
    private String skills;
    private String techStack;
    private Double hourlyRate;
    private String bio;
    private String location;
    private String experienceLevel;
    private Integer yearsOfExperience;
    private String preferredWorkType;
    private String portfolioUrl;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String education;
    private String certifications;
    private String languages;
    private Boolean availableForWork;
}
