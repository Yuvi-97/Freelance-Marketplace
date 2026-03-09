package com.example.demo.Service;

import com.example.demo.Model.ApplicationStatus;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectApplication;
import com.example.demo.Model.ProjectStatus;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.ProjectApplicationRepository;
import com.example.demo.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectApplicationService {

    @Autowired
    private ProjectApplicationRepository projectApplicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Transactional
    public ProjectApplication applyToProject(Long projectId, Long freelancerId, String coverLetter) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new RuntimeException("Project is not open for applications");
        }

        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        Optional<ProjectApplication> existingApp = projectApplicationRepository.findByProjectIdAndFreelancerId(projectId, freelancerId);
        if (existingApp.isPresent()) {
            throw new RuntimeException("Freelancer has already applied to this project");
        }

        ProjectApplication application = new ProjectApplication();
        application.setProject(project);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.PENDING);
        application.setCoverLetter(coverLetter);

        return projectApplicationRepository.save(application);
    }

    public List<ProjectApplication> getApplicationsForProject(Long projectId) {
        return projectApplicationRepository.findByProjectId(projectId);
    }

    public List<ProjectApplication> getApplicationsByFreelancer(Long freelancerId) {
        return projectApplicationRepository.findByFreelancerId(freelancerId);
    }

    @Transactional
    public ProjectApplication acceptApplication(Long applicationId, Long clientId) {
        ProjectApplication application = projectApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Only pending applications can be accepted");
        }

        Project project = application.getProject();
        
        if (project.getClient() == null || !project.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: Client does not own this project");
        }

        application.setStatus(ApplicationStatus.ACCEPTED);
        projectApplicationRepository.save(application);

        projectApplicationRepository.updateStatusForProjectApplications(project.getId(), ApplicationStatus.REJECTED, ApplicationStatus.PENDING);

        project.setAssignedFreelancer(application.getFreelancer());
        project.setStatus(ProjectStatus.ASSIGNED);
        projectRepository.save(project);

        return application;
    }
}
