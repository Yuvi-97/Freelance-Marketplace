package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.ApplicationStatus;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectApplication;
import com.example.demo.Model.ProjectStatus;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.ProjectApplicationRepository;
import com.example.demo.Repository.ProjectRepository;
import com.example.demo.Repository.ReviewRepository;
import com.example.demo.dto.FreelancerDashboardDto;
import com.example.demo.dto.FreelancerProfileSetupRequest;

@Service
public class FreelancerService {

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private ProjectApplicationRepository projectApplicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Freelancer createFreelancer(Freelancer freelancer) {
        return freelancerRepository.save(freelancer);
    }

    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    public Freelancer getFreelancerById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Freelancer not found with id: " + id));
    }

    public Freelancer updateFreelancer(Long id, FreelancerProfileSetupRequest req) {
        return freelancerRepository.findById(id).map(f -> {
            applySetupRequest(f, req);
            return freelancerRepository.save(f);
        }).orElseThrow(() -> new RuntimeException("Freelancer not found with id: " + id));
    }

    public void applySetupRequest(Freelancer f, FreelancerProfileSetupRequest req) {
        if (req.getName() != null) f.setName(req.getName());
        if (req.getProfessionalHeadline() != null) f.setProfessionalHeadline(req.getProfessionalHeadline());
        if (req.getSkills() != null) f.setSkills(req.getSkills());
        if (req.getTechStack() != null) f.setTechStack(req.getTechStack());
        if (req.getHourlyRate() != null) f.setHourlyRate(req.getHourlyRate());
        if (req.getBio() != null) f.setBio(req.getBio());
        if (req.getLocation() != null) f.setLocation(req.getLocation());
        if (req.getExperienceLevel() != null) f.setExperienceLevel(req.getExperienceLevel());
        if (req.getYearsOfExperience() != null) f.setYearsOfExperience(req.getYearsOfExperience());
        if (req.getPreferredWorkType() != null) f.setPreferredWorkType(req.getPreferredWorkType());
        if (req.getPortfolioUrl() != null) f.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getResumeUrl() != null) f.setResumeUrl(req.getResumeUrl());
        if (req.getGithubUrl() != null) f.setGithubUrl(req.getGithubUrl());
        if (req.getLinkedinUrl() != null) f.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getEducation() != null) f.setEducation(req.getEducation());
        if (req.getCertifications() != null) f.setCertifications(req.getCertifications());
        if (req.getLanguages() != null) f.setLanguages(req.getLanguages());
        if (req.getAvailableForWork() != null) f.setAvailableForWork(req.getAvailableForWork());
    }

    public List<Freelancer> searchFreelancersByUsername(String username) {
        return freelancerRepository.findByUsernameLike(username);
    }

    public List<Freelancer> getFreelancersByHourlyRateRange(Double min, Double max) {
        return freelancerRepository.findByHourlyRateBetween(min, max);
    }

    public Freelancer getFreelancerByUserId(Long userId) {
        return freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found for userId: " + userId));
    }

    public FreelancerDashboardDto getDashboard(Long freelancerId) {
        FreelancerDashboardDto dto = new FreelancerDashboardDto();

        List<ProjectApplication> allApplications = projectApplicationRepository.findByFreelancerId(freelancerId);
        List<Project> assignedProjects = projectRepository.findByAssignedFreelancerIdAndStatus(freelancerId, ProjectStatus.ASSIGNED);
        List<Project> completedProjects = projectRepository.findByAssignedFreelancerIdAndStatus(freelancerId, ProjectStatus.COMPLETED);

        dto.setAppliedProjectsCount(allApplications.size());
        dto.setPendingApplicationsCount(
                allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING).count()
        );
        dto.setAssignedProjectsCount(assignedProjects.size());
        dto.setCompletedProjectsCount(completedProjects.size());

        Double avgRating = reviewRepository.getAverageRatingForFreelancer(freelancerId);
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        dto.setTotalReviews(reviewRepository.countByFreelancerId(freelancerId));

        // Return last 5 applications as recent activity
        dto.setRecentApplications(
                allApplications.stream()
                        .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                        .limit(5)
                        .toList()
        );
        dto.setAssignedProjects(assignedProjects);
        dto.setCompletedProjects(completedProjects);

        return dto;
    }
}
