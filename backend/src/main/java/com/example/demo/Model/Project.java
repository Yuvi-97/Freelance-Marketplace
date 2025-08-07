package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private Freelancer assignedFreelancer;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "client_id")
    private ClientProfile client;
}
