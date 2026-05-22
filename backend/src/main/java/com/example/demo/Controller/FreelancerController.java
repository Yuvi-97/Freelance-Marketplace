package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Model.Freelancer;
import com.example.demo.Service.FreelancerService;
import com.example.demo.dto.FreelancerDashboardDto;

@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {

    @Autowired
    private FreelancerService freelancerService;

    @GetMapping
    public List<Freelancer> getAllFreelancers() {
        return freelancerService.getAllFreelancers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Freelancer> getFreelancer(@PathVariable Long id) {
        return ResponseEntity.ok(freelancerService.getFreelancerById(id));
    }

    @GetMapping("/search")
    public List<Freelancer> searchFreelancersByUsername(@RequestParam String username) {
        return freelancerService.searchFreelancersByUsername(username);
    }

    @GetMapping("/rate")
    public List<Freelancer> getFreelancersByHourlyRateRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return freelancerService.getFreelancersByHourlyRateRange(min, max);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Freelancer> getFreelancerByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(freelancerService.getFreelancerByUserId(userId));
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<FreelancerDashboardDto> getFreelancerDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(freelancerService.getDashboard(id));
    }
}
