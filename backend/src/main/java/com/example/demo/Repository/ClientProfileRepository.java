package com.example.demo.Repository;

import com.example.demo.Model.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByUser(User user);
    Optional<ClientProfile> findByUserId(Long userId);

}
