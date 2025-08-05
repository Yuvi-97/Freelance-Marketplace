package com.example.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role; 
   
    //client details
    private String clientName;
    private String company;
    private String email;
    private String phone;
    private String profileUrl;
    
    //freelancer details
    private String name;
    private String skills;
    private Double hourlyRate;
    private String bio;
}
