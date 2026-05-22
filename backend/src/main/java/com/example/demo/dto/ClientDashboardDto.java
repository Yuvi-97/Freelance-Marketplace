package com.example.demo.dto;

import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectApplication;
import lombok.Data;

import java.util.List;

@Data
public class ClientDashboardDto {

    // Stats
    private long totalProjectsPosted;
    private long openProjectsCount;
    private long assignedProjectsCount;
    private long completedProjectsCount;
    private long totalApplicantsCount;

    // Recent activity
    private List<Project> recentProjects;
    private List<ProjectApplication> recentApplications;
}
