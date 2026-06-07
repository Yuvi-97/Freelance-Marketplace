package com.example.demo.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "client_profiles")
public class ClientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Info
    private String clientName;
    private String contactEmail;
    private String phone;
    private String profileUrl;

    // Company Details
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String companyDescription;

    private String industry;
    private String companyWebsite;
    private String companySize;  // e.g. "1-10", "11-50", "51-200", "201-500", "500+"
    private String location;

    // Verification & Trust
    private Boolean verified = false;

    // Social Links
    private String linkedinUrl;
    private String twitterUrl;

    // Relationships
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"client", "applications"})
    private List<Project> projects = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
