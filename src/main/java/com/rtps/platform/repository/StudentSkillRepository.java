package com.rtps.platform.repository;

import com.rtps.platform.entity.SkillMaster;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentProfileId(Long studentProfileId);
    Optional<StudentSkill> findByStudentProfileAndSkillMaster(StudentProfile studentProfile, SkillMaster skillMaster);
    Optional<StudentSkill> findByStudentProfileIdAndSkillMasterId(Long studentProfileId, Long skillMasterId);
    boolean existsByStudentProfileAndSkillMaster(StudentProfile studentProfile, SkillMaster skillMaster);
    void deleteByStudentProfileIdAndId(Long studentProfileId, Long id);

    @Query("SELECT s.skillMaster.name, COUNT(s) FROM StudentSkill s GROUP BY s.skillMaster.name ORDER BY COUNT(s) DESC")
    List<Object[]> findTopSkillsAcrossStudents();
}
