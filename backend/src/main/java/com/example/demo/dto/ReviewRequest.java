package com.example.demo.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private int rating;
    private String comment;
    private Long reviewerId;       // User ID of the reviewer
    private Long freelancerId;     // Set when reviewing a freelancer
    private Long clientId;         // Set when reviewing a client
    private Long projectId;        // The project this review is for
}
