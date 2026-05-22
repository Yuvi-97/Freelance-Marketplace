package com.example.demo.dto;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import lombok.Data;

@Data
public class ProfileResponse {

    // User fields
    private Long userId;
    private String username;
    private String email;
    private String role;

    // Shared profile fields
    private Long profileId;
    private String profileUrl;

    // Freelancer-specific
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

    // Client-specific
    private String clientName;
    private String phone;
    private String companyName;
    private String companyDescription;
    private String industry;
    private String companyWebsite;
    private String companySize;
    private Boolean verified;
    private String twitterUrl;

    public static ProfileResponse fromFreelancer(User user, Freelancer f) {
        ProfileResponse r = new ProfileResponse();
        r.setUserId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole());
        r.setProfileId(f.getId());
        r.setProfileUrl(f.getProfileUrl());
        r.setName(f.getName());
        r.setProfessionalHeadline(f.getProfessionalHeadline());
        r.setSkills(f.getSkills());
        r.setTechStack(f.getTechStack());
        r.setHourlyRate(f.getHourlyRate());
        r.setBio(f.getBio());
        r.setLocation(f.getLocation());
        r.setExperienceLevel(f.getExperienceLevel());
        r.setYearsOfExperience(f.getYearsOfExperience());
        r.setPreferredWorkType(f.getPreferredWorkType());
        r.setPortfolioUrl(f.getPortfolioUrl());
        r.setResumeUrl(f.getResumeUrl());
        r.setGithubUrl(f.getGithubUrl());
        r.setLinkedinUrl(f.getLinkedinUrl());
        r.setEducation(f.getEducation());
        r.setCertifications(f.getCertifications());
        r.setLanguages(f.getLanguages());
        r.setAvailableForWork(f.getAvailableForWork());
        return r;
    }

    public static ProfileResponse fromClient(User user, ClientProfile c) {
        ProfileResponse r = new ProfileResponse();
        r.setUserId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole());
        r.setProfileId(c.getId());
        r.setProfileUrl(c.getProfileUrl());
        r.setClientName(c.getClientName());
        r.setPhone(c.getPhone());
        r.setCompanyName(c.getCompanyName());
        r.setCompanyDescription(c.getCompanyDescription());
        r.setIndustry(c.getIndustry());
        r.setCompanyWebsite(c.getCompanyWebsite());
        r.setCompanySize(c.getCompanySize());
        r.setLocation(c.getLocation());
        r.setVerified(c.getVerified());
        r.setLinkedinUrl(c.getLinkedinUrl());
        r.setTwitterUrl(c.getTwitterUrl());
        return r;
    }

    public static ProfileResponse basic(User user) {
        ProfileResponse r = new ProfileResponse();
        r.setUserId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole());
        return r;
    }
}
