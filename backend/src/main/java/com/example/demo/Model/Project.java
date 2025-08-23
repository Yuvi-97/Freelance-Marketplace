package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double budget;
    private LocalDate deadline;
    private String status; 
    private LocalDate createdDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_categories", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "category")
    private java.util.List<String> categories = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    @JsonIgnoreProperties("projects")
    private Freelancer assignedFreelancer;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonBackReference
    private ClientProfile client;
}
