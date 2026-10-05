package com.rtps.platform.repository;

import com.rtps.platform.entity.Recommendation;
import com.rtps.platform.entity.enums.RecommendationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByCareerRoleId(Long careerRoleId);
    List<Recommendation> findBySkillMasterId(Long skillMasterId);
    List<Recommendation> findByCareerRoleIdAndSkillMasterIdIn(Long careerRoleId, List<Long> skillMasterIds);
    List<Recommendation> findByCareerRoleIdAndType(Long careerRoleId, RecommendationType type);
}
