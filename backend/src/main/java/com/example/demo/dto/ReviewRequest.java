package com.example.demo.dto;

import lombok.Data;

@Data
public class ReviewRequest {

    private int rating;
    private String comment;

    private Long reviewerId;
    private Long freelancerId;
    private Long clientId;
}