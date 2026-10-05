package com.rtps.platform.service;

import com.rtps.platform.dto.request.CareerRoleRequest;
import com.rtps.platform.dto.response.CareerRequiredSkillDto;
import com.rtps.platform.dto.response.CareerRoleDto;
import com.rtps.platform.dto.response.RecommendationDto;
import com.rtps.platform.entity.CareerRequiredSkill;
import com.rtps.platform.entity.CareerRole;
import com.rtps.platform.entity.Recommendation;
import com.rtps.platform.entity.SkillMaster;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.CareerRequiredSkillRepository;
import com.rtps.platform.repository.CareerRoleRepository;
import com.rtps.platform.repository.RecommendationRepository;
import com.rtps.platform.repository.SkillMasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareerRoleService {

    private final CareerRoleRepository careerRoleRepository;
    private final CareerRequiredSkillRepository careerRequiredSkillRepository;
    private final SkillMasterRepository skillMasterRepository;
    private final RecommendationRepository recommendationRepository;

    public CareerRoleService(CareerRoleRepository careerRoleRepository,
                             CareerRequiredSkillRepository careerRequiredSkillRepository,
                             SkillMasterRepository skillMasterRepository,
                             RecommendationRepository recommendationRepository) {
        this.careerRoleRepository = careerRoleRepository;
        this.careerRequiredSkillRepository = careerRequiredSkillRepository;
        this.skillMasterRepository = skillMasterRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public List<CareerRoleDto> getAllRoles() {
        return careerRoleRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CareerRoleDto getRoleById(Long id) {
        CareerRole role = careerRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + id));
        return mapToDto(role);
    }

    @Transactional
    public CareerRoleDto createRole(CareerRoleRequest request) {
        if (careerRoleRepository.existsByTitleIgnoreCase(request.getTitle().trim())) {
            throw new BadRequestException("Career role with title '" + request.getTitle() + "' already exists.");
        }

        CareerRole role = new CareerRole(
                request.getTitle().trim(),
                request.getDescription(),
                request.getDepartmentFocus()
        );

        CareerRole saved = careerRoleRepository.save(role);

        if (request.getRequiredSkills() != null) {
            for (CareerRoleRequest.RequiredSkillItem item : request.getRequiredSkills()) {
                SkillMaster skill = skillMasterRepository.findById(item.getSkillMasterId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + item.getSkillMasterId()));
                CareerRequiredSkill crs = new CareerRequiredSkill(
                        saved,
                        skill,
                        item.getMinimumLevel(),
                        item.getWeight()
                );
                careerRequiredSkillRepository.save(crs);
            }
        }

        return getRoleById(saved.getId());
    }

    @Transactional
    public CareerRoleDto updateRole(Long id, CareerRoleRequest request) {
        CareerRole role = careerRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + id));

        role.setTitle(request.getTitle().trim());
        role.setDescription(request.getDescription());
        role.setDepartmentFocus(request.getDepartmentFocus());

        careerRoleRepository.save(role);

        if (request.getRequiredSkills() != null) {
            // Replace required skills
            List<CareerRequiredSkill> existing = careerRequiredSkillRepository.findByCareerRoleId(id);
            careerRequiredSkillRepository.deleteAll(existing);

            for (CareerRoleRequest.RequiredSkillItem item : request.getRequiredSkills()) {
                SkillMaster skill = skillMasterRepository.findById(item.getSkillMasterId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + item.getSkillMasterId()));
                CareerRequiredSkill crs = new CareerRequiredSkill(
                        role,
                        skill,
                        item.getMinimumLevel(),
                        item.getWeight()
                );
                careerRequiredSkillRepository.save(crs);
            }
        }

        return getRoleById(id);
    }

    @Transactional
    public void deleteRole(Long id) {
        CareerRole role = careerRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + id));
        careerRoleRepository.delete(role);
    }

    public CareerRoleDto mapToDto(CareerRole r) {
        CareerRoleDto dto = new CareerRoleDto();
        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setDepartmentFocus(r.getDepartmentFocus());

        List<CareerRequiredSkill> required = careerRequiredSkillRepository.findByCareerRoleId(r.getId());
        dto.setRequiredSkills(required.stream().map(crs -> new CareerRequiredSkillDto(
                crs.getId(),
                crs.getSkillMaster().getId(),
                crs.getSkillMaster().getName(),
                crs.getSkillMaster().getCategory(),
                crs.getMinimumLevel(),
                crs.getWeight()
        )).collect(Collectors.toList()));

        List<Recommendation> recs = recommendationRepository.findByCareerRoleId(r.getId());
        dto.setRecommendations(recs.stream().map(rec -> new RecommendationDto(
                rec.getId(),
                rec.getCareerRole().getId(),
                rec.getSkillMaster() != null ? rec.getSkillMaster().getId() : null,
                rec.getSkillMaster() != null ? rec.getSkillMaster().getName() : null,
                rec.getTitle(),
                rec.getType(),
                rec.getProvider(),
                rec.getUrl(),
                rec.getEstimatedDuration()
        )).collect(Collectors.toList()));

        return dto;
    }
}
