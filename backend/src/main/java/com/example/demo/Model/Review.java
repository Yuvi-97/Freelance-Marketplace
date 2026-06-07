package com.example.demo.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDate createdAt;

    // The project this review is tied to (prevents duplicate reviews per project)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({"applications", "client", "assignedFreelancer", "categories"})
    private Project project;

    // Who gave the review
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id")
    @JsonIgnoreProperties({"password"})
    private User reviewer;

    // Freelancer being reviewed (null if reviewing a client)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "freelancer_id")
    @JsonIgnoreProperties({"applications", "projects", "user"})
    private Freelancer freelancer;

    // Client being reviewed (null if reviewing a freelancer)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({"projects", "user"})
    private ClientProfile client;
}
