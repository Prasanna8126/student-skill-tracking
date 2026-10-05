package com.rtps.platform.repository;

import com.rtps.platform.entity.Course;
import com.rtps.platform.entity.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStudentProfileId(Long studentProfileId);
    List<Course> findByStudentProfileIdAndStatus(Long studentProfileId, CourseStatus status);
    long countByStudentProfileId(Long studentProfileId);
    long countByStudentProfileIdAndStatus(Long studentProfileId, CourseStatus status);

    @Query("SELECT c FROM Course c WHERE c.studentProfile.id = :studentId AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.platform) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Course> searchCourses(
            @Param("studentId") Long studentId,
            @Param("status") CourseStatus status,
            @Param("query") String query);
}
