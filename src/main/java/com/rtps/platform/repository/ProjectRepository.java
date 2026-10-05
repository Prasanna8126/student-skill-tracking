package com.rtps.platform.repository;

import com.rtps.platform.entity.Project;
import com.rtps.platform.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudentProfileId(Long studentProfileId);
    List<Project> findByStudentProfileIdAndStatus(Long studentProfileId, ProjectStatus status);
    long countByStudentProfileId(Long studentProfileId);
    long countByStudentProfileIdAndStatus(Long studentProfileId, ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE p.studentProfile.id = :studentId AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.technologiesUsed) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Project> searchProjects(
            @Param("studentId") Long studentId,
            @Param("status") ProjectStatus status,
            @Param("query") String query);
}
