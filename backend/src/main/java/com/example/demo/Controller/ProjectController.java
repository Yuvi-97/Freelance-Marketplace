package com.example.demo.Controller;

import com.example.demo.Model.*;
import com.example.demo.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        try {
            return ResponseEntity.ok(projectService.updateProject(id, project));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientId}")
    public List<Project> getProjectsByClientId(@PathVariable Long clientId) {
        return projectService.getProjectsByClientId(clientId);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public List<Project> getProjectsByFreelancerId(@PathVariable Long freelancerId) {
        return projectService.getProjectsByFreelancerId(freelancerId);
    }

    @PutMapping("/{projectId}/accept")
    public ResponseEntity<Project> acceptProject(
            @PathVariable Long projectId,
            @RequestParam Long freelancerId) {
        try {
            Project updatedProject = projectService.assignFreelancerToProject(projectId, freelancerId);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/budget")
    public List<Project> getProjectsByBudgetRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return projectService.getProjectsByRange(min, max);
    }

    @GetMapping
    public Page<Project> getAllProjects(@PageableDefault(size = 10) Pageable pageable) {
        return projectService.getAllProjects(pageable);
    }
}
