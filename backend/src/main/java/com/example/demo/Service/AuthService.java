package com.example.demo.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.security.JwtUtil;
import com.example.demo.Repository.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    private final ClientProfileRepository clientProfileRepository;
    private final FreelancerRepository freelancerRepository;
    // Profiles will be created later via Profile Setup API

        

public LoginResponse login(LoginRequest request) {
    try {
        String identifier = request.getUsername();
        // Support login by email or username
        User user = userRepository.findByUsername(identifier)
                .orElseGet(() -> userRepository.findByEmail(identifier).orElse(null));
        if (user == null) {
            throw new RuntimeException("Invalid username/email or password");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String authenticatedUsername = authentication.getName();
        String token = jwtUtil.generateToken(authenticatedUsername);

        return new LoginResponse(token, user.getId());

    } catch (AuthenticationException e) {
        throw new RuntimeException("Invalid username or password");
    }
}


public User registerUser(RegisterRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new IllegalArgumentException("Username already exists");
    }
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new IllegalArgumentException("Email already exists");
    }

    // 1. Create User
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());

    User savedUser = userRepository.save(user);

    // 2. Also Create CLIENT or FREELANCER profile
    if (request.getRole().equals("CLIENT")) {
        ClientProfile cp = new ClientProfile();
        cp.setUser(savedUser);
        clientProfileRepository.save(cp);
    }

    if (request.getRole().equals("FREELANCER")) {
        Freelancer freelancer = new Freelancer();
        freelancer.setUser(savedUser);
        freelancerRepository.save(freelancer);
    }

    return savedUser;
}

}
