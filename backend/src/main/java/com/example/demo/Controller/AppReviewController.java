package com.example.demo.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.AppReview;
import com.example.demo.Service.AppReviewService;

@RestController
@RequestMapping("/api/app-reviews")
@CrossOrigin("*")
public class AppReviewController {

    private final AppReviewService appReviewService;

    public AppReviewController(AppReviewService appReviewService) {
        this.appReviewService = appReviewService;
    }

    @PostMapping
    public AppReview create(@RequestBody AppReview review) {
        return appReviewService.createReview(review);
    }

    @GetMapping
    public List<AppReview> getAll() {
        return appReviewService.getAllReviews();
    }

    @GetMapping("/user/{userId}")
    public List<AppReview> getByUser(@PathVariable Long userId) {
        return appReviewService.getReviewsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        appReviewService.deleteReview(id);
        return "Review deleted successfully";
    }
}