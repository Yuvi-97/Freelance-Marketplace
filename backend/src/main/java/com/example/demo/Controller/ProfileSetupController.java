package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.ClientProfileSetupRequest;
import com.example.demo.dto.FreelancerProfileSetupRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/setup")
@RequiredArgsConstructor
public class ProfileSetupController {

    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final FreelancerRepository freelancerRepository;

    @PostMapping("/client")
    public ResponseEntity<ClientProfile> setupClient(@RequestBody ClientProfileSetupRequest request) {
        User currentUser = getCurrentUser();
        ClientProfile profile = clientProfileRepository.findByUser(currentUser).orElseGet(ClientProfile::new);
        profile.setUser(currentUser);
        profile.setClientName(request.getClientName());
        profile.setCompany(request.getCompany());
        profile.setContactEmail(currentUser.getEmail());
        profile.setPhone(request.getPhone());
        return ResponseEntity.ok(clientProfileRepository.save(profile));
    }

    @PostMapping("/freelancer")
    public ResponseEntity<Freelancer> setupFreelancer(@RequestBody FreelancerProfileSetupRequest request) {
        User currentUser = getCurrentUser();
        Freelancer profile = freelancerRepository.findByUser(currentUser).orElseGet(Freelancer::new);
        profile.setUser(currentUser);
        profile.setName(request.getName());
        profile.setEmail(currentUser.getEmail());
        profile.setSkills(request.getSkills());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setBio(request.getBio());
        return ResponseEntity.ok(freelancerRepository.save(profile));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}


