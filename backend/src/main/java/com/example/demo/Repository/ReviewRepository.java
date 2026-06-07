package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Model.Review;
import com.example.demo.dto.FreelancerRatingDto;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.freelancer.id = :freelancerId")
    Double getAverageRatingForFreelancer(@Param("freelancerId") Long freelancerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.freelancer.id = :freelancerId")
    long countByFreelancerId(@Param("freelancerId") Long freelancerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.client.id = :clientId")
    Double getAverageRatingForClient(@Param("clientId") Long clientId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.client.id = :clientId")
    long countByClientId(@Param("clientId") Long clientId);

    @Query("SELECT new com.example.demo.dto.FreelancerRatingDto(r.freelancer, AVG(r.rating)) "
            + "FROM Review r GROUP BY r.freelancer ORDER BY AVG(r.rating) DESC")
    List<FreelancerRatingDto> findTopFreelancers(Pageable pageable);

    List<Review> findByFreelancerId(Long freelancerId);

    List<Review> findByClientId(Long clientId);

    // Check if a review already exists for this project by this reviewer
    Optional<Review> findByProjectIdAndReviewerId(Long projectId, Long reviewerId);

    boolean existsByProjectIdAndReviewerId(Long projectId, Long reviewerId);
}
