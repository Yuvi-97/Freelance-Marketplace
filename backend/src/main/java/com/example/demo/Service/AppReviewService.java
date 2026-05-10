package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Model.AppReview;
import com.example.demo.Repository.AppReviewRepository;

@Service
public class AppReviewService {

    private final AppReviewRepository appReviewRepository;

    public AppReviewService(AppReviewRepository appReviewRepository) {
        this.appReviewRepository = appReviewRepository;
    }

    // Create Review
    public AppReview createReview(AppReview review) {
        return appReviewRepository.save(review);
    }

    // Get All Reviews
    public List<AppReview> getAllReviews() {
        return appReviewRepository.findAll();
    }

    // Get Reviews By User
    public List<AppReview> getReviewsByUser(Long userId) {
        return appReviewRepository.findByUserId(userId);
    }

    // Delete Review
    public void deleteReview(Long id) {
        appReviewRepository.deleteById(id);
    }
}