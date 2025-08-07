package com.example.demo.Controller;

import com.example.demo.Model.*;
import com.example.demo.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {

    @Autowired
    private FreelancerService freelancerService;

    @PostMapping
    public Freelancer createFreelancer(@RequestBody Freelancer freelancer) {
        return freelancerService.createFreelancer(freelancer);
    }

    @GetMapping
    public List<Freelancer> getAllFreelancers() {
        return freelancerService.getAllFreelancers();
    }

    @GetMapping("/{id}")
    public Freelancer getFreelancer(@PathVariable Long id) {
        return freelancerService.getFreelancerById(id);
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
}
