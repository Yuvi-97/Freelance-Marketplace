package com.example.demo.dto;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    public static ProfileResponse basic(User user) {
        ProfileResponse r = new ProfileResponse();
        r.userId = user.getId();
        r.username = user.getUsername();
        r.email = user.getEmail();
        r.role = user.getRole();
        return r;
    }
    public static ProfileResponse fromClient(User user, ClientProfile c) {
        ProfileResponse r = basic(user);
        r.clientName = c.getClientName();
        r.company = c.getCompany();
        r.phone = c.getPhone();
        return r;
    }
    public static ProfileResponse fromFreelancer(User user, Freelancer f) {
        ProfileResponse r = basic(user);
        r.name = f.getName();
        r.skills = f.getSkills();
        r.hourlyRate = f.getHourlyRate();
        r.bio = f.getBio();
        return r;
    }
    private Long userId;

    private String username;
    private String email;
    private String role;

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


