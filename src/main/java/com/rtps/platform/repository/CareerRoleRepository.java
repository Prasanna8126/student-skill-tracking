package com.rtps.platform.repository;

import com.rtps.platform.entity.CareerRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerRoleRepository extends JpaRepository<CareerRole, Long> {
    Optional<CareerRole> findByTitleIgnoreCase(String title);
    boolean existsByTitleIgnoreCase(String title);
}
