package com.example.demo.Repository;

import com.example.demo.Model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientId(Long clientId);
    List<Project> findByAssignedFreelancerId(Long freelancerId);

    @Query("SELECT p FROM Project p WHERE p.budget BETWEEN :min AND :max")
    List<Project> findByBudgetBetween(@Param("min") Double min, @Param("max") Double max);

    Page<Project> findAll(Pageable pageable);
}
