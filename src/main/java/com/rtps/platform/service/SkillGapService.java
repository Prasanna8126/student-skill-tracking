package com.rtps.platform.service;

import com.rtps.platform.dto.response.*;
import com.rtps.platform.entity.*;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.entity.enums.CourseStatus;
import com.rtps.platform.entity.enums.ProjectStatus;
import com.rtps.platform.entity.enums.RecommendationType;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    private final CareerRoleRepository careerRoleRepository;
    private final CareerRequiredSkillRepository careerRequiredSkillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final RecommendationRepository recommendationRepository;
    private final CertificationRepository certificationRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;

    public SkillGapService(CareerRoleRepository careerRoleRepository,
                           CareerRequiredSkillRepository careerRequiredSkillRepository,
                           StudentSkillRepository studentSkillRepository,
                           RecommendationRepository recommendationRepository,
                           CertificationRepository certificationRepository,
                           CourseRepository courseRepository,
                           ProjectRepository projectRepository) {
        this.careerRoleRepository = careerRoleRepository;
        this.careerRequiredSkillRepository = careerRequiredSkillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.recommendationRepository = recommendationRepository;
        this.certificationRepository = certificationRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
    }

    public SkillGapResponse analyzeSkillGap(StudentProfile studentProfile, Long careerRoleId) {
        CareerRole careerRole = careerRoleRepository.findById(careerRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + careerRoleId));

        List<CareerRequiredSkill> requiredSkills = careerRequiredSkillRepository.findByCareerRoleId(careerRoleId);
        List<StudentSkill> studentSkills = studentSkillRepository.findByStudentProfileId(studentProfile.getId());

        // Map student skills by SkillMaster id
        Map<Long, StudentSkill> studentSkillMap = studentSkills.stream()
                .collect(Collectors.toMap(s -> s.getSkillMaster().getId(), s -> s));

        List<SkillItemDto> alreadyAcquired = new ArrayList<>();
        List<SkillItemDto> needsImprovement = new ArrayList<>();
        List<SkillItemDto> missingSkills = new ArrayList<>();

        double totalRequiredWeight = 0;
        double earnedWeight = 0;

        List<Long> needCourseOrCertSkillIds = new ArrayList<>();

        for (CareerRequiredSkill crs : requiredSkills) {
            SkillMaster sm = crs.getSkillMaster();
            int weight = Math.max(crs.getWeight(), 1);
            totalRequiredWeight += weight;

            int requiredProficiency = crs.getMinimumLevel().getDefaultProficiency();

            if (studentSkillMap.containsKey(sm.getId())) {
                StudentSkill ss = studentSkillMap.get(sm.getId());
                int studentProf = ss.getProficiency();

                if (ss.getSkillLevel().meetsOrExceeds(crs.getMinimumLevel()) && studentProf >= requiredProficiency) {
                    // Acquired
                    earnedWeight += weight;
                    alreadyAcquired.add(new SkillItemDto(
                            sm.getId(),
                            sm.getName(),
                            sm.getCategory(),
                            crs.getMinimumLevel(),
                            ss.getSkillLevel(),
                            studentProf,
                            requiredProficiency,
                            weight,
                            "ACQUIRED"
                    ));
                } else {
                    // Needs improvement
                    double partialRatio = Math.min(1.0, (double) studentProf / (double) requiredProficiency);
                    earnedWeight += (weight * partialRatio * 0.7); // partial credit
                    needsImprovement.add(new SkillItemDto(
                            sm.getId(),
                            sm.getName(),
                            sm.getCategory(),
                            crs.getMinimumLevel(),
                            ss.getSkillLevel(),
                            studentProf,
                            requiredProficiency,
                            weight,
                            "NEEDS_IMPROVEMENT"
                    ));
                    needCourseOrCertSkillIds.add(sm.getId());
                }
            } else {
                // Missing
                missingSkills.add(new SkillItemDto(
                        sm.getId(),
                        sm.getName(),
                        sm.getCategory(),
                        crs.getMinimumLevel(),
                        null,
                        0,
                        requiredProficiency,
                        weight,
                        "MISSING"
                ));
                needCourseOrCertSkillIds.add(sm.getId());
            }
        }

        int matchPercentage = totalRequiredWeight > 0
                ? (int) Math.round((earnedWeight / totalRequiredWeight) * 100.0)
                : 100;
        matchPercentage = Math.min(100, Math.max(0, matchPercentage));

        // Recommendations: Fetch recommendations for missing/needs improvement skills,
        // or general role recommendations if none matched specifically
        List<Recommendation> allRoleRecs = recommendationRepository.findByCareerRoleId(careerRoleId);
        List<RecommendationDto> recommendedCourses = new ArrayList<>();
        List<RecommendationDto> recommendedCertifications = new ArrayList<>();

        for (Recommendation r : allRoleRecs) {
            boolean isTargetSkill = r.getSkillMaster() == null || needCourseOrCertSkillIds.contains(r.getSkillMaster().getId());
            if (isTargetSkill) {
                RecommendationDto dto = new RecommendationDto(
                        r.getId(),
                        careerRoleId,
                        r.getSkillMaster() != null ? r.getSkillMaster().getId() : null,
                        r.getSkillMaster() != null ? r.getSkillMaster().getName() : null,
                        r.getTitle(),
                        r.getType(),
                        r.getProvider(),
                        r.getUrl(),
                        r.getEstimatedDuration()
                );
                if (r.getType() == RecommendationType.COURSE) {
                    recommendedCourses.add(dto);
                } else {
                    recommendedCertifications.add(dto);
                }
            }
        }

        SkillGapResponse response = new SkillGapResponse();
        response.setCareerRoleId(careerRole.getId());
        response.setCareerRoleTitle(careerRole.getTitle());
        response.setCareerRoleDescription(careerRole.getDescription());
        response.setSkillMatchPercentage(matchPercentage);
        response.setTotalRequiredSkills(requiredSkills.size());
        response.setAlreadyAcquired(alreadyAcquired);
        response.setNeedsImprovement(needsImprovement);
        response.setMissingSkills(missingSkills);
        response.setRecommendedCourses(recommendedCourses);
        response.setRecommendedCertifications(recommendedCertifications);

        return response;
    }

    public CareerProgressDto getCareerProgress(StudentProfile studentProfile) {
        CareerProgressDto dto = new CareerProgressDto();

        CareerRole targetRole = studentProfile.getTargetCareer();
        if (targetRole == null) {
            // Pick first career role as default if student hasn't selected one yet
            List<CareerRole> roles = careerRoleRepository.findAll();
            if (!roles.isEmpty()) {
                targetRole = roles.get(0);
            }
        }

        int totalSkillsOwned = (int) studentSkillRepository.findByStudentProfileId(studentProfile.getId()).size();
        dto.setTotalSkillsOwned(totalSkillsOwned);

        int completedCerts = (int) certificationRepository.countByStudentProfileId(studentProfile.getId());
        int verifiedCerts = (int) certificationRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), CertificationStatus.VERIFIED);
        int completedCourses = (int) courseRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), CourseStatus.COMPLETED);
        int completedProjects = (int) projectRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), ProjectStatus.COMPLETED);

        dto.setCompletedCertifications(completedCerts);
        dto.setVerifiedCertifications(verifiedCerts);
        dto.setCompletedCourses(completedCourses);
        dto.setCompletedProjects(completedProjects);

        if (targetRole != null) {
            dto.setTargetCareerId(targetRole.getId());
            dto.setTargetCareerTitle(targetRole.getTitle());
            dto.setTargetCareerDescription(targetRole.getDescription());

            SkillGapResponse gap = analyzeSkillGap(studentProfile, targetRole.getId());
            dto.setSkillMatchPercentage(gap.getSkillMatchPercentage());
            dto.setSkillsRemainingCount(gap.getMissingSkills().size() + gap.getNeedsImprovement().size());
            dto.setAcquiredSkills(gap.getAlreadyAcquired());

            List<SkillItemDto> pending = new ArrayList<>();
            pending.addAll(gap.getNeedsImprovement());
            pending.addAll(gap.getMissingSkills());
            dto.setPendingSkills(pending);

            // Composite career readiness calculation:
            // 50% skill match + 20% verified certs (up to 3) + 20% completed projects (up to 3) + 10% completed courses (up to 3)
            double certFactor = Math.min(1.0, verifiedCerts / 3.0) * 100.0;
            double projectFactor = Math.min(1.0, completedProjects / 3.0) * 100.0;
            double courseFactor = Math.min(1.0, completedCourses / 3.0) * 100.0;

            double readiness = (gap.getSkillMatchPercentage() * 0.50) +
                               (certFactor * 0.20) +
                               (projectFactor * 0.20) +
                               (courseFactor * 0.10);

            int finalReadiness = (int) Math.round(readiness);
            finalReadiness = Math.min(100, Math.max(0, finalReadiness));
            dto.setCareerReadinessScore(finalReadiness);

            if (finalReadiness >= 85) {
                dto.setReadinessCategory("Job Ready (High Employability)");
            } else if (finalReadiness >= 65) {
                dto.setReadinessCategory("Internship / Associate Ready");
            } else if (finalReadiness >= 40) {
                dto.setReadinessCategory("Developing Practitioner");
            } else {
                dto.setReadinessCategory("Foundational Learner");
            }
        } else {
            dto.setSkillMatchPercentage(0);
            dto.setSkillsRemainingCount(0);
            dto.setCareerReadinessScore(0);
            dto.setReadinessCategory("Target Career Not Selected");
            dto.setAcquiredSkills(Collections.emptyList());
            dto.setPendingSkills(Collections.emptyList());
        }

        return dto;
    }

    public DashboardStatsDto getDashboardStats(StudentProfile studentProfile) {
        DashboardStatsDto dto = new DashboardStatsDto();

        User user = studentProfile.getUser();
        dto.setStudentName(user.getFullName());
        dto.setStudentEmail(user.getEmail());
        dto.setStudentId(studentProfile.getStudentId());
        dto.setDepartment(studentProfile.getDepartment());
        if (studentProfile.getTargetCareer() != null) {
            dto.setTargetCareerTitle(studentProfile.getTargetCareer().getTitle());
        }

        List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(studentProfile.getId());
        dto.setTotalSkills(skills.size());

        dto.setTotalCertifications((int) certificationRepository.countByStudentProfileId(studentProfile.getId()));
        dto.setVerifiedCertifications((int) certificationRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), CertificationStatus.VERIFIED));
        dto.setPendingCertifications((int) certificationRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), CertificationStatus.PENDING));

        dto.setTotalCourses((int) courseRepository.countByStudentProfileId(studentProfile.getId()));
        dto.setCoursesCompleted((int) courseRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), CourseStatus.COMPLETED));

        dto.setTotalProjects((int) projectRepository.countByStudentProfileId(studentProfile.getId()));
        dto.setProjectsCompleted((int) projectRepository.countByStudentProfileIdAndStatus(studentProfile.getId(), ProjectStatus.COMPLETED));

        // Distribution by category
        Map<String, Integer> byCategory = new HashMap<>();
        Map<String, Integer> byLevel = new HashMap<>();
        int totalProficiencySum = 0;

        for (StudentSkill s : skills) {
            String cat = s.getSkillMaster().getCategory();
            byCategory.put(cat, byCategory.getOrDefault(cat, 0) + 1);

            String lvl = s.getSkillLevel().name();
            byLevel.put(lvl, byLevel.getOrDefault(lvl, 0) + 1);

            totalProficiencySum += s.getProficiency();
        }

        dto.setSkillsByCategory(byCategory);
        dto.setSkillsByLevel(byLevel);

        // Overall progress
        int avgSkillProficiency = skills.isEmpty() ? 0 : totalProficiencySum / skills.size();
        dto.setOverallLearningProgress(avgSkillProficiency);

        // Career Match
        if (studentProfile.getTargetCareer() != null) {
            SkillGapResponse gap = analyzeSkillGap(studentProfile, studentProfile.getTargetCareer().getId());
            dto.setCareerSkillMatch(gap.getSkillMatchPercentage());
        } else {
            dto.setCareerSkillMatch(0);
        }

        // Recent items
        List<Certification> certs = certificationRepository.findByStudentProfileId(studentProfile.getId());
        dto.setRecentCertifications(certs.stream()
                .sorted(Comparator.comparing(Certification::getIssueDate).reversed())
                .limit(4)
                .map(this::mapCertDto)
                .collect(Collectors.toList()));

        List<Project> projects = projectRepository.findByStudentProfileId(studentProfile.getId());
        dto.setRecentProjects(projects.stream()
                .limit(4)
                .map(this::mapProjectDto)
                .collect(Collectors.toList()));

        List<Course> courses = courseRepository.findByStudentProfileIdAndStatus(studentProfile.getId(), CourseStatus.IN_PROGRESS);
        dto.setInProgressCourses(courses.stream()
                .limit(3)
                .map(this::mapCourseDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private CertificationDto mapCertDto(Certification c) {
        CertificationDto dto = new CertificationDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setIssuingOrganization(c.getIssuingOrganization());
        dto.setIssueDate(c.getIssueDate());
        dto.setExpiryDate(c.getExpiryDate());
        dto.setStatus(c.getStatus());
        return dto;
    }

    private ProjectDto mapProjectDto(Project p) {
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setTechnologiesUsed(p.getTechnologiesUsed());
        dto.setStatus(p.getStatus());
        dto.setGithubUrl(p.getGithubUrl());
        return dto;
    }

    private CourseDto mapCourseDto(Course c) {
        CourseDto dto = new CourseDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setPlatform(c.getPlatform());
        dto.setProgressPercentage(c.getProgressPercentage());
        dto.setStatus(c.getStatus());
        return dto;
    }
}
