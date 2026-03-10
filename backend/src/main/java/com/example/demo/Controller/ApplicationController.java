package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.ProjectApplication;
import com.example.demo.Service.ProjectApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ProjectApplicationService projectApplicationService;

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ProjectApplication>> getApplicationsForFreelancer(
            @PathVariable Long freelancerId) {

        List<ProjectApplication> applications =
                projectApplicationService.getApplicationsForFreelancer(freelancerId);

        return ResponseEntity.ok(applications);
    }
}