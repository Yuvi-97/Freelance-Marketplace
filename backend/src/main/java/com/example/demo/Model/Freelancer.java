package com.example.demo.Model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "freelancers")
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Info
    private String name;
    private String email;
    private String professionalHeadline;
    private String bio;
    private String location;
    private String profileUrl;

    // Professional Details
    private String experienceLevel;   // BEGINNER, INTERMEDIATE, EXPERT
    private Integer yearsOfExperience;
    private String preferredWorkType; // FULL_TIME, PART_TIME, CONTRACT, FREELANCE

    // Skills & Tech (stored as comma-separated for simplicity, queryable)
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String techStack;

    // Rates
    private Double hourlyRate;

    // Links
    private String portfolioUrl;
    private String resumeUrl;
    private String githubUrl;
    private String linkedinUrl;

    // Education & Certifications (stored as JSON-like text for flexibility)
    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    // Languages spoken
    @Column(columnDefinition = "TEXT")
    private String languages;

    // Availability
    private Boolean availableForWork = true;

    // Metadata
    private LocalDate joinedDate;

    // Relationships
    @OneToMany(mappedBy = "assignedFreelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("assignedFreelancer")
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"freelancer", "project"})
    private List<ProjectApplication> applications = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
