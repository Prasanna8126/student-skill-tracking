package com.rtps.platform.repository;

import com.rtps.platform.entity.SkillMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillMasterRepository extends JpaRepository<SkillMaster, Long> {
    Optional<SkillMaster> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<SkillMaster> findByCategory(String category);
    List<SkillMaster> findByNameContainingIgnoreCase(String name);
}
