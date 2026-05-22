package com.example.demo.dto;

import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectApplication;
import lombok.Data;

import java.util.List;

@Data
public class FreelancerDashboardDto {

    // Stats
    private long appliedProjectsCount;
    private long assignedProjectsCount;
    private long completedProjectsCount;
    private long pendingApplicationsCount;
    private Double averageRating;
    private long totalReviews;

    // Recent activity
    private List<ProjectApplication> recentApplications;
    private List<Project> assignedProjects;
    private List<Project> completedProjects;
}
