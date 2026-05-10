package com.example.demo.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating; // 1 to 5

    private String comment;

    private LocalDate createdAt;

    // Who gave review
    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    // Freelancer being reviewed
    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;

    // Client being reviewed
    @ManyToOne
    @JoinColumn(name = "client_id")
    private ClientProfile client;

}