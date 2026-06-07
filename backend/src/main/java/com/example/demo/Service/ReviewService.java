package com.example.demo.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectStatus;
import com.example.demo.Model.Review;
import com.example.demo.Model.User;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.ProjectRepository;
import com.example.demo.Repository.ReviewRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.FreelancerRatingDto;
import com.example.demo.dto.ReviewRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final ProjectRepository projectRepository;

    public Review createReview(ReviewRequest request) {
        // Prevent duplicate review for same project by same reviewer
        if (request.getProjectId() != null
                && reviewRepository.existsByProjectIdAndReviewerId(request.getProjectId(), request.getReviewerId())) {
            throw new RuntimeException("You have already submitted a review for this project");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDate.now());

        User reviewer = userRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        review.setReviewer(reviewer);

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            // Only allow reviews on completed projects
            if (project.getStatus() != ProjectStatus.COMPLETED) {
                throw new RuntimeException("Reviews can only be submitted for completed projects");
            }
            review.setProject(project);
        }

        if (request.getFreelancerId() != null) {
            Freelancer freelancer = freelancerRepository.findById(request.getFreelancerId())
                    .orElseThrow(() -> new RuntimeException("Freelancer not found"));
            review.setFreelancer(freelancer);
        }

        if (request.getClientId() != null) {
            ClientProfile client = clientProfileRepository.findById(request.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            review.setClient(client);
        }

        return reviewRepository.save(review);
    }

    public Double getFreelancerRating(Long freelancerId) {
        Double avg = reviewRepository.getAverageRatingForFreelancer(freelancerId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public Double getClientRating(Long clientId) {
        Double avg = reviewRepository.getAverageRatingForClient(clientId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsForFreelancer(Long freelancerId) {
        return reviewRepository.findByFreelancerId(freelancerId);
    }

    public List<Review> getReviewsForClient(Long clientId) {
        return reviewRepository.findByClientId(clientId);
    }

    public boolean hasReviewed(Long projectId, Long reviewerId) {
        return reviewRepository.existsByProjectIdAndReviewerId(projectId, reviewerId);
    }

    public List<FreelancerRatingDto> getTopFreelancers(Pageable pageable) {
        return reviewRepository.findTopFreelancers(pageable);
    }

    public List<FreelancerRatingDto> getTopFreelancers(int topN) {
        if (topN <= 0) topN = 3;
        return reviewRepository.findTopFreelancers(PageRequest.of(0, topN));
    }
}