package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.AppReview;

public interface AppReviewRepository extends JpaRepository<AppReview, Long> {

    List<AppReview> findByUserId(Long userId);
}