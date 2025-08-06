package com.example.demo.Repository;

import com.example.demo.Model.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByUser(User user);
}
