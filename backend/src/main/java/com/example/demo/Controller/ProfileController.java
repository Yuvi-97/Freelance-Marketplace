package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.ProfileResponse;
import com.example.demo.dto.ProfileUpdateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final FreelancerRepository freelancerRepository;

    @GetMapping
    public ResponseEntity<ProfileResponse> getMyProfile() {
        User user = getCurrentUser();
        if ("CLIENT".equalsIgnoreCase(user.getRole())) {
            ClientProfile profile = clientProfileRepository.findByUser(user).orElseGet(() -> {
                ClientProfile p = new ClientProfile();
                p.setUser(user);
                return clientProfileRepository.save(p);
            });
            return ResponseEntity.ok(ProfileResponse.fromClient(user, profile));
        } else if ("FREELANCER".equalsIgnoreCase(user.getRole())) {
            Freelancer profile = freelancerRepository.findByUser(user).orElseGet(() -> {
                Freelancer f = new Freelancer();
                f.setUser(user);
                f.setEmail(user.getEmail());
                return freelancerRepository.save(f);
            });
            return ResponseEntity.ok(ProfileResponse.fromFreelancer(user, profile));
        }
        return ResponseEntity.ok(ProfileResponse.basic(user));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateMyProfile(@RequestBody ProfileUpdateRequest req) {
        User user = getCurrentUser();
        if ("CLIENT".equalsIgnoreCase(user.getRole())) {
            ClientProfile profile = clientProfileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not found"));
            profile.setClientName(req.getClientName());
            profile.setCompany(req.getCompany());
            profile.setPhone(req.getPhone());
            clientProfileRepository.save(profile);
            return ResponseEntity.ok(ProfileResponse.fromClient(user, profile));
        } else if ("FREELANCER".equalsIgnoreCase(user.getRole())) {
            Freelancer profile = freelancerRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not found"));
            profile.setName(req.getName());
            profile.setSkills(req.getSkills());
            profile.setHourlyRate(req.getHourlyRate());
            profile.setBio(req.getBio());
            profile.setEmail(user.getEmail());
            profile.setProjects(profile.getProjects());
            freelancerRepository.save(profile);
            return ResponseEntity.ok(ProfileResponse.fromFreelancer(user, profile));
        }
        return ResponseEntity.ok(ProfileResponse.basic(user));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}


