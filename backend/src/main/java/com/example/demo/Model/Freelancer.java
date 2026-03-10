package com.example.demo.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String skills;
    private Double hourlyRate;
    private String bio;
    private LocalDate joinedDate;
    private String profileUrl;
    @OneToMany(mappedBy = "assignedFreelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("assignedFreelancer")
    private List<Project> projects;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
   @JsonIgnoreProperties({"freelancer","project"})
    private List<ProjectApplication> applications = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
