package com.example.demo.Service;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ClientProfileRepository clientRepo;
    private final FreelancerRepository freelancerRepo;

        

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtUtil.generateToken(authentication.getName());
            return new LoginResponse(token);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    public User registerUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password!
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        if ("CLIENT".equalsIgnoreCase(request.getRole())) {
            ClientProfile client = new ClientProfile();
            client.setClientName(request.getClientName());
            client.setCompany(request.getCompany());
            client.setContactEmail(request.getEmail());
            client.setPhone(request.getPhone());
            client.setProfileUrl(request.getProfileUrl());
            client.setUser(savedUser);
            clientRepo.save(client);

        } else if ("FREELANCER".equalsIgnoreCase(request.getRole())) {
            Freelancer freelancer = new Freelancer();
            freelancer.setName(request.getName());
            freelancer.setEmail(request.getEmail());
            freelancer.setSkills(request.getSkills());
            freelancer.setHourlyRate(request.getHourlyRate());
            freelancer.setBio(request.getBio());
            freelancer.setProfileUrl(request.getProfileUrl());
            freelancer.setUser(savedUser);
            freelancerRepo.save(freelancer);
        }

        return savedUser;
    }
}
