package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Model.Review;
import com.example.demo.dto.FreelancerRatingDto;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.freelancer.id = :freelancerId")
    Double getAverageRatingForFreelancer(Long freelancerId);

    @Query("SELECT new com.example.demo.dto.FreelancerRatingDto(r.freelancer, AVG(r.rating)) "
     + "FROM Review r GROUP BY r.freelancer ORDER BY AVG(r.rating) DESC")
    List<FreelancerRatingDto> findTopFreelancers(Pageable pageable);
}