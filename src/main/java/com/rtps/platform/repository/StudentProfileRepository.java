package com.rtps.platform.repository;

import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);

    @Query("SELECT p.department, COUNT(p) FROM StudentProfile p WHERE p.department IS NOT NULL GROUP BY p.department")
    List<Object[]> countStudentsByDepartment();

    @Query("SELECT p.academicYear, COUNT(p) FROM StudentProfile p WHERE p.academicYear IS NOT NULL GROUP BY p.academicYear")
    List<Object[]> countStudentsByAcademicYear();

    @Query("SELECT p FROM StudentProfile p JOIN p.user u WHERE " +
           "(:query IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.studentId) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:dept IS NULL OR p.department = :dept)")
    List<StudentProfile> searchStudents(@Param("query") String query, @Param("dept") String dept);
}
