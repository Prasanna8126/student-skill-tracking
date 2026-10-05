package com.rtps.platform.service;

import com.rtps.platform.dto.request.StudentProfileRequest;
import com.rtps.platform.dto.response.StudentProfileDto;
import com.rtps.platform.entity.CareerRole;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.entity.enums.CourseStatus;
import com.rtps.platform.entity.enums.ProjectStatus;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final CareerRoleRepository careerRoleRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final CertificationRepository certificationRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository,
                                 UserRepository userRepository,
                                 CareerRoleRepository careerRoleRepository,
                                 StudentSkillRepository studentSkillRepository,
                                 CertificationRepository certificationRepository,
                                 CourseRepository courseRepository,
                                 ProjectRepository projectRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.careerRoleRepository = careerRoleRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.certificationRepository = certificationRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
    }

    public StudentProfile getOrCreateProfileForUser(User user) {
        return studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile(user);
                    return studentProfileRepository.save(newProfile);
                });
    }

    public StudentProfileDto getProfileForUser(User user) {
        StudentProfile profile = getOrCreateProfileForUser(user);
        return mapToDto(profile);
    }

    public StudentProfileDto getProfileById(Long profileId) {
        StudentProfile profile = studentProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + profileId));
        return mapToDto(profile);
    }

    @Transactional
    public StudentProfileDto updateProfile(User user, StudentProfileRequest request) {
        StudentProfile profile = getOrCreateProfileForUser(user);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        if (request.getStudentId() != null) {
            String newStudentId = request.getStudentId().trim();
            if (!newStudentId.equalsIgnoreCase(profile.getStudentId()) &&
                studentProfileRepository.existsByStudentId(newStudentId)) {
                throw new BadRequestException("Student ID '" + newStudentId + "' is already registered to another student.");
            }
            profile.setStudentId(newStudentId);
        }

        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment().trim());
        if (request.getAcademicYear() != null) profile.setAcademicYear(request.getAcademicYear().trim());
        if (request.getCollege() != null) profile.setCollege(request.getCollege().trim());
        if (request.getPhone() != null) profile.setPhone(request.getPhone().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl().trim());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl().trim());
        if (request.getProfileImageUrl() != null) profile.setProfileImageUrl(request.getProfileImageUrl().trim());

        if (request.getTargetCareerId() != null) {
            CareerRole careerRole = careerRoleRepository.findById(request.getTargetCareerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + request.getTargetCareerId()));
            profile.setTargetCareer(careerRole);
        }

        StudentProfile updated = studentProfileRepository.save(profile);
        return mapToDto(updated);
    }

    public StudentProfileDto mapToDto(StudentProfile p) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setEmail(p.getUser().getEmail());
        dto.setFullName(p.getUser().getFullName());
        dto.setStudentId(p.getStudentId());
        dto.setDepartment(p.getDepartment());
        dto.setAcademicYear(p.getAcademicYear());
        dto.setCollege(p.getCollege());
        dto.setPhone(p.getPhone());
        dto.setBio(p.getBio());
        dto.setResumeUrl(p.getResumeUrl());
        dto.setLinkedinUrl(p.getLinkedinUrl());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setProfileImageUrl(p.getProfileImageUrl());
        dto.setRegisteredAt(p.getUser().getCreatedAt());

        if (p.getTargetCareer() != null) {
            dto.setTargetCareerId(p.getTargetCareer().getId());
            dto.setTargetCareerTitle(p.getTargetCareer().getTitle());
        }

        dto.setTotalSkills(p.getSkills() != null ? p.getSkills().size() : (int) studentSkillRepository.findByStudentProfileId(p.getId()).size());
        dto.setTotalCertifications((int) certificationRepository.countByStudentProfileId(p.getId()));
        dto.setVerifiedCertifications((int) certificationRepository.countByStudentProfileIdAndStatus(p.getId(), CertificationStatus.VERIFIED));
        dto.setCompletedCourses((int) courseRepository.countByStudentProfileIdAndStatus(p.getId(), CourseStatus.COMPLETED));
        dto.setCompletedProjects((int) projectRepository.countByStudentProfileIdAndStatus(p.getId(), ProjectStatus.COMPLETED));

        return dto;
    }
}
