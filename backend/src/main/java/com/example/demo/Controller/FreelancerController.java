package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Freelancer;
import com.example.demo.Service.FreelancerService;

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

    @GetMapping("/user/{userId}")
    public Freelancer getFreelancerByUserId(@PathVariable Long userId) {
        return freelancerService.getFreelancerByUserId(userId);
    }
}
