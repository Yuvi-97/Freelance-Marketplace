package com.example.demo.Repository;

import com.example.demo.Model.ProjectApplication;
import com.example.demo.Model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {

    List<ProjectApplication> findByProjectId(Long projectId);
    
    List<ProjectApplication> findByFreelancerId(Long freelancerId);
    
    Optional<ProjectApplication> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    
    @Modifying
    @Query("UPDATE ProjectApplication pa SET pa.status = :newStatus WHERE pa.project.id = :projectId AND pa.status = :oldStatus")
    void updateStatusForProjectApplications(@Param("projectId") Long projectId, @Param("newStatus") ApplicationStatus newStatus, @Param("oldStatus") ApplicationStatus oldStatus);
}
