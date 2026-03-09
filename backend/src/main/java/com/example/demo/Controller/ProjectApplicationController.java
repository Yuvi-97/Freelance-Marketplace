package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.ProjectApplication;
import com.example.demo.Service.ProjectApplicationService;
import com.example.demo.dto.ProjectApplicationRequest;

@RestController
@RequestMapping("/api/projects/{projectId}/applications")
public class ProjectApplicationController {

    @Autowired
    private ProjectApplicationService projectApplicationService;

    @PostMapping
    public ResponseEntity<?> applyToProject(
            @PathVariable Long projectId,
            @RequestBody ProjectApplicationRequest request) {
        try {
            ProjectApplication application = projectApplicationService.applyToProject(
                    projectId, request.getFreelancerId(), request.getCoverLetter());
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ProjectApplication>> getApplicationsForProject(@PathVariable Long projectId) {
        List<ProjectApplication> applications = projectApplicationService.getApplicationsForProject(projectId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{applicationId}/accept")
    public ResponseEntity<?> acceptApplication(
            @PathVariable Long projectId,
            @PathVariable Long applicationId,
            @RequestParam Long clientId) {
        try {
            ProjectApplication application = projectApplicationService.acceptApplication(applicationId, clientId);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
