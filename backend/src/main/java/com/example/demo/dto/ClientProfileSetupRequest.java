package com.example.demo.dto;

import lombok.Data;

@Data
public class ClientProfileSetupRequest {
    private String clientName;
    private String phone;
    private String companyName;
    private String companyDescription;
    private String industry;
    private String companyWebsite;
    private String companySize;
    private String location;
    private String linkedinUrl;
    private String twitterUrl;
}
