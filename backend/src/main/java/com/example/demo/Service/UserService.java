package com.example.demo.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Model.ClientProfile;
import com.example.demo.Model.Freelancer;
import com.example.demo.Model.User;
import com.example.demo.Repository.ClientProfileRepository;
import com.example.demo.Repository.FreelancerRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.RegisterRequest;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientProfileRepository clientRepo;

    @Autowired
    private FreelancerRepository freelancerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    
    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public boolean deleteUserById(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            clientRepo.findByUser(user).ifPresent(clientRepo::delete);

            freelancerRepo.findByUser(user).ifPresent(freelancerRepo::delete);

            userRepository.delete(user);
            return true;
        }
        return false;
    }
}
