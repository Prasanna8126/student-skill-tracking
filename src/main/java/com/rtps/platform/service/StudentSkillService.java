package com.rtps.platform.service;

import com.rtps.platform.dto.request.StudentSkillRequest;
import com.rtps.platform.dto.response.SkillMasterDto;
import com.rtps.platform.dto.response.StudentSkillDto;
import com.rtps.platform.entity.SkillMaster;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.StudentSkill;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.SkillMasterRepository;
import com.rtps.platform.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final SkillMasterRepository skillMasterRepository;

    public StudentSkillService(StudentSkillRepository studentSkillRepository,
                               SkillMasterRepository skillMasterRepository) {
        this.studentSkillRepository = studentSkillRepository;
        this.skillMasterRepository = skillMasterRepository;
    }

    public List<SkillMasterDto> getAllMasterSkills() {
        return skillMasterRepository.findAll()
                .stream()
                .map(this::mapToMasterDto)
                .collect(Collectors.toList());
    }

    public List<StudentSkillDto> getStudentSkills(Long studentProfileId) {
        return studentSkillRepository.findByStudentProfileId(studentProfileId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentSkillDto addSkill(StudentProfile profile, StudentSkillRequest request) {
        SkillMaster skillMaster;

        if (request.getSkillMasterId() != null) {
            skillMaster = skillMasterRepository.findById(request.getSkillMasterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + request.getSkillMasterId()));
        } else if (request.getSkillName() != null && !request.getSkillName().isBlank()) {
            String skillName = request.getSkillName().trim();
            skillMaster = skillMasterRepository.findByNameIgnoreCase(skillName)
                    .orElseGet(() -> {
                        String category = (request.getCategory() != null && !request.getCategory().isBlank())
                                ? request.getCategory().trim() : "General";
                        return skillMasterRepository.save(new SkillMaster(skillName, category, "User added skill"));
                    });
        } else {
            throw new BadRequestException("Either skillMasterId or skillName must be provided.");
        }

        if (studentSkillRepository.existsByStudentProfileAndSkillMaster(profile, skillMaster)) {
            throw new BadRequestException("Skill '" + skillMaster.getName() + "' is already in your skills profile. You can update its proficiency.");
        }

        StudentSkill studentSkill = new StudentSkill(
                profile,
                skillMaster,
                request.getSkillLevel(),
                request.getProficiency(),
                request.getEvidenceUrl()
        );

        StudentSkill saved = studentSkillRepository.save(studentSkill);
        return mapToDto(saved);
    }

    @Transactional
    public StudentSkillDto updateSkill(StudentProfile profile, Long skillId, StudentSkillRequest request) {
        StudentSkill studentSkill = studentSkillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill record not found with id: " + skillId));

        if (!studentSkill.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to update this skill.");
        }

        if (request.getSkillLevel() != null) {
            studentSkill.setSkillLevel(request.getSkillLevel());
        }
        studentSkill.setProficiency(request.getProficiency());
        if (request.getEvidenceUrl() != null) {
            studentSkill.setEvidenceUrl(request.getEvidenceUrl().trim());
        }

        StudentSkill updated = studentSkillRepository.save(studentSkill);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteSkill(StudentProfile profile, Long skillId) {
        StudentSkill studentSkill = studentSkillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill record not found with id: " + skillId));

        if (!studentSkill.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to delete this skill.");
        }

        studentSkillRepository.delete(studentSkill);
    }

    public StudentSkillDto mapToDto(StudentSkill s) {
        StudentSkillDto dto = new StudentSkillDto();
        dto.setId(s.getId());
        dto.setSkillMasterId(s.getSkillMaster().getId());
        dto.setSkillName(s.getSkillMaster().getName());
        dto.setCategory(s.getSkillMaster().getCategory());
        dto.setDescription(s.getSkillMaster().getDescription());
        dto.setSkillLevel(s.getSkillLevel());
        dto.setProficiency(s.getProficiency());
        dto.setDateAdded(s.getDateAdded());
        dto.setEvidenceUrl(s.getEvidenceUrl());
        return dto;
    }

    public SkillMasterDto mapToMasterDto(SkillMaster m) {
        return new SkillMasterDto(m.getId(), m.getName(), m.getCategory(), m.getDescription());
    }
}
