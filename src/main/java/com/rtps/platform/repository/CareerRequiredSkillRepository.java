package com.rtps.platform.repository;

import com.rtps.platform.entity.CareerRequiredSkill;
import com.rtps.platform.entity.CareerRole;
import com.rtps.platform.entity.SkillMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRequiredSkillRepository extends JpaRepository<CareerRequiredSkill, Long> {
    List<CareerRequiredSkill> findByCareerRoleId(Long careerRoleId);
    Optional<CareerRequiredSkill> findByCareerRoleAndSkillMaster(CareerRole careerRole, SkillMaster skillMaster);
    void deleteByCareerRoleIdAndId(Long careerRoleId, Long id);
}
