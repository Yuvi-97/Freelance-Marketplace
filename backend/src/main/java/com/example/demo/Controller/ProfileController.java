package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
                p.setContactEmail(user.getEmail());
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
            ClientProfile profile = clientProfileRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));
            applyClientUpdate(profile, req);
            clientProfileRepository.save(profile);
            return ResponseEntity.ok(ProfileResponse.fromClient(user, profile));
        } else if ("FREELANCER".equalsIgnoreCase(user.getRole())) {
            Freelancer profile = freelancerRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));
            applyFreelancerUpdate(profile, req);
            freelancerRepository.save(profile);
            return ResponseEntity.ok(ProfileResponse.fromFreelancer(user, profile));
        }
        return ResponseEntity.ok(ProfileResponse.basic(user));
    }

    // Also expose a GET by userId for freelancer profile (used by FreelancerProfile page)
    @GetMapping("/freelancer/user/{userId}")
    public ResponseEntity<ProfileResponse> getFreelancerProfileByUserId(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Freelancer profile = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));
        return ResponseEntity.ok(ProfileResponse.fromFreelancer(user, profile));
    }

    private void applyFreelancerUpdate(Freelancer f, ProfileUpdateRequest req) {
        if (req.getName() != null) f.setName(req.getName());
        if (req.getProfessionalHeadline() != null) f.setProfessionalHeadline(req.getProfessionalHeadline());
        if (req.getSkills() != null) f.setSkills(req.getSkills());
        if (req.getTechStack() != null) f.setTechStack(req.getTechStack());
        if (req.getHourlyRate() != null) f.setHourlyRate(req.getHourlyRate());
        if (req.getBio() != null) f.setBio(req.getBio());
        if (req.getLocation() != null) f.setLocation(req.getLocation());
        if (req.getExperienceLevel() != null) f.setExperienceLevel(req.getExperienceLevel());
        if (req.getYearsOfExperience() != null) f.setYearsOfExperience(req.getYearsOfExperience());
        if (req.getPreferredWorkType() != null) f.setPreferredWorkType(req.getPreferredWorkType());
        if (req.getPortfolioUrl() != null) f.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getResumeUrl() != null) f.setResumeUrl(req.getResumeUrl());
        if (req.getGithubUrl() != null) f.setGithubUrl(req.getGithubUrl());
        if (req.getLinkedinUrl() != null) f.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getEducation() != null) f.setEducation(req.getEducation());
        if (req.getCertifications() != null) f.setCertifications(req.getCertifications());
        if (req.getLanguages() != null) f.setLanguages(req.getLanguages());
        if (req.getAvailableForWork() != null) f.setAvailableForWork(req.getAvailableForWork());
        if (req.getProfileUrl() != null) f.setProfileUrl(req.getProfileUrl());
    }

    private void applyClientUpdate(ClientProfile c, ProfileUpdateRequest req) {
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
        if (req.getProfileUrl() != null) c.setProfileUrl(req.getProfileUrl());
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
