package com.example.demo.Repository;

import com.example.demo.Model.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByUser(User user);
    @Query("SELECT f FROM Freelancer f WHERE f.user.username LIKE %:username%")
    List<Freelancer> findByUsernameLike(@Param("username") String username);    

    @Query("SELECT f FROM Freelancer f WHERE f.hourlyRate BETWEEN :min AND :max")
    List<Freelancer> findByHourlyRateBetween(@Param("min") Double min, @Param("max") Double max);
}
