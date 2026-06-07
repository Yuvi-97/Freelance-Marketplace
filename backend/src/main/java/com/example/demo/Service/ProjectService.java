package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.Project;
import com.example.demo.Model.ProjectStatus;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

  public Project createProject(Project project) {
    project.setStatus(ProjectStatus.OPEN);
    project.setCreatedDate(java.time.LocalDate.now());

    if (project.getClient() != null && project.getClient().getId() != null) {
        Long clientId = project.getClient().getId();
        ClientProfile client = clientProfileRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
        project.setClient(client); 
    }

    return projectRepository.save(project);
}


    public Project updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id).map(project -> {
            project.setTitle(updatedProject.getTitle());
            project.setDescription(updatedProject.getDescription());
            project.setBudget(updatedProject.getBudget());
            project.setDeadline(updatedProject.getDeadline());
            project.setStatus(updatedProject.getStatus());
            project.setAssignedFreelancer(updatedProject.getAssignedFreelancer());
            return projectRepository.save(project);
        }).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public List<Project> getProjectsByClientId(Long clientId) {
        return projectRepository.findByClientId(clientId);
    }

    public List<Project> getProjectsByFreelancerId(Long freelancerId) {
        return projectRepository.findByAssignedFreelancerId(freelancerId);
    }

    public List<Project> getProjectsByStatus(com.example.demo.Model.ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public Project assignFreelancerToProject(Long projectId, Long freelancerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        project.setAssignedFreelancer(freelancer);
        project.setStatus(ProjectStatus.ASSIGNED);
        return projectRepository.save(project);
    }
    public List<Project> getProjectsByRange(Double min,Double max){
        return projectRepository.findByBudgetBetween(min,max);
    }

    public Page<Project> getAllProjectsPageable(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    /**
     * Mark a project as COMPLETED.
     * Only the client who owns the project can complete it.
     * Project must be in ASSIGNED or IN_PROGRESS state.
     */
    public Project completeProject(Long projectId, Long clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getClient() == null || !project.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: Only the project owner can complete it");
        }

        if (project.getStatus() != ProjectStatus.ASSIGNED
                && project.getStatus() != ProjectStatus.IN_PROGRESS) {
            throw new RuntimeException("Project must be ASSIGNED or IN_PROGRESS to be completed");
        }

        project.setStatus(ProjectStatus.COMPLETED);
        return projectRepository.save(project);
    }
}
