package com.example.demo.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Review;
import com.example.demo.Service.ReviewService;
import com.example.demo.dto.FreelancerRatingDto;
import com.example.demo.dto.ReviewRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public Review createReview(@RequestBody ReviewRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping("/freelancer/{id}/rating")
    public Double getFreelancerRating(@PathVariable Long id) {
        return reviewService.getFreelancerRating(id);
    }
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/top")
    public List<FreelancerRatingDto> getTopFreelancers(@RequestParam(defaultValue = "3") int limit) {
        return reviewService.getTopFreelancers(limit);
    }
}