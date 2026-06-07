package com.example.demo.Controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.Review;
import com.example.demo.Service.ReviewService;
import com.example.demo.dto.FreelancerRatingDto;
import com.example.demo.dto.ReviewRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            return ResponseEntity.ok(reviewService.createReview(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/freelancer/{id}/rating")
    public Double getFreelancerRating(@PathVariable Long id) {
        return reviewService.getFreelancerRating(id);
    }

    @GetMapping("/freelancer/{id}")
    public List<Review> getReviewsForFreelancer(@PathVariable Long id) {
        return reviewService.getReviewsForFreelancer(id);
    }

    @GetMapping("/client/{id}/rating")
    public Double getClientRating(@PathVariable Long id) {
        return reviewService.getClientRating(id);
    }

    @GetMapping("/client/{id}")
    public List<Review> getReviewsForClient(@PathVariable Long id) {
        return reviewService.getReviewsForClient(id);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkReviewed(
            @RequestParam Long projectId,
            @RequestParam Long reviewerId) {
        boolean reviewed = reviewService.hasReviewed(projectId, reviewerId);
        return ResponseEntity.ok(Map.of("reviewed", reviewed));
    }

    @GetMapping("/top")
    public List<FreelancerRatingDto> getTopFreelancers(@RequestParam(defaultValue = "3") int limit) {
        return reviewService.getTopFreelancers(limit);
    }
}
