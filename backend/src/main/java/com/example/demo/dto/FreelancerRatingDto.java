package com.example.demo.dto;

import com.example.demo.Model.Freelancer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerRatingDto {
    private Freelancer freelancer;
    private Double averageRating;
}
