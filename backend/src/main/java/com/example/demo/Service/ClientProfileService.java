package com.example.demo.Service;

import com.example.demo.Model.*;
import com.example.demo.Repository.*;
import com.example.demo.dto.ClientDashboardDto;
import com.example.demo.dto.ClientProfileSetupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientProfileService {

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectApplicationRepository projectApplicationRepository;

    public ClientProfile createClient(ClientProfile clientProfile) {
        return clientProfileRepository.save(clientProfile);
    }

    public ClientProfile getClientByUserId(Long userId) {
        return clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Client not found for userId: " + userId));
    }

    public List<ClientProfile> getAllClients() {
        return clientProfileRepository.findAll();
    }

    public ClientProfile getClientById(Long id) {
        return clientProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
    }

    public void applySetupRequest(ClientProfile c, ClientProfileSetupRequest req) {
        if (req.getClientName() != null) c.setClientName(req.getClientName());
        if (req.getPhone() != null) c.setPhone(req.getPhone());
        if (req.getCompanyName() != null) c.setCompanyName(req.getCompanyName());
        if (req.getCompanyDescription() != null) c.setCompanyDescription(req.getCompanyDescription());
        if (req.getIndustry() != null) c.setIndustry(req.getIndustry());
        if (req.getCompanyWebsite() != null) c.setCompanyWebsite(req.getCompanyWebsite());
        if (req.getCompanySize() != null) c.setCompanySize(req.getCompanySize());
        if (req.getLocation() != null) c.setLocation(req.getLocation());
        if (req.getLinkedinUrl() != null) c.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getTwitterUrl() != null) c.setTwitterUrl(req.getTwitterUrl());
    }

    public ClientDashboardDto getDashboard(Long clientId) {
        ClientDashboardDto dto = new ClientDashboardDto();

        List<Project> allProjects = projectRepository.findByClientId(clientId);

        long openCount = allProjects.stream().filter(p -> p.getStatus() == ProjectStatus.OPEN).count();
        long assignedCount = allProjects.stream().filter(p -> p.getStatus() == ProjectStatus.ASSIGNED).count();
        long completedCount = allProjects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count();

        // Count total applicants across all projects
        long totalApplicants = allProjects.stream()
                .mapToLong(p -> projectApplicationRepository.findByProjectId(p.getId()).size())
                .sum();

        dto.setTotalProjectsPosted(allProjects.size());
        dto.setOpenProjectsCount(openCount);
        dto.setAssignedProjectsCount(assignedCount);
        dto.setCompletedProjectsCount(completedCount);
        dto.setTotalApplicantsCount(totalApplicants);

        // Recent 5 projects sorted by createdDate desc
        dto.setRecentProjects(
                allProjects.stream()
                        .filter(p -> p.getCreatedDate() != null)
                        .sorted((a, b) -> b.getCreatedDate().compareTo(a.getCreatedDate()))
                        .limit(5)
                        .toList()
        );

        // Recent applications across all client projects (last 5)
        List<ProjectApplication> recentApps = allProjects.stream()
                .flatMap(p -> projectApplicationRepository.findByProjectId(p.getId()).stream())
                .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                .limit(5)
                .toList();
        dto.setRecentApplications(recentApps);

        return dto;
    }
}
