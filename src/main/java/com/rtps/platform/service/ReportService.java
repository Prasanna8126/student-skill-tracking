package com.rtps.platform.service;

import com.rtps.platform.dto.response.StudentCareerReportDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.repository.CareerRoleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportService {

    private final StudentProfileService studentProfileService;
    private final StudentSkillService studentSkillService;
    private final CertificationService certificationService;
    private final CourseService courseService;
    private final ProjectService projectService;
    private final CareerRoleService careerRoleService;
    private final SkillGapService skillGapService;
    private final CareerRoleRepository careerRoleRepository;

    public ReportService(StudentProfileService studentProfileService,
                         StudentSkillService studentSkillService,
                         CertificationService certificationService,
                         CourseService courseService,
                         ProjectService projectService,
                         CareerRoleService careerRoleService,
                         SkillGapService skillGapService,
                         CareerRoleRepository careerRoleRepository) {
        this.studentProfileService = studentProfileService;
        this.studentSkillService = studentSkillService;
        this.certificationService = certificationService;
        this.courseService = courseService;
        this.projectService = projectService;
        this.careerRoleService = careerRoleService;
        this.skillGapService = skillGapService;
        this.careerRoleRepository = careerRoleRepository;
    }

    public StudentCareerReportDto generateStudentReport(StudentProfile profile) {
        StudentCareerReportDto report = new StudentCareerReportDto();

        report.setProfile(studentProfileService.mapToDto(profile));
        report.setSkills(studentSkillService.getStudentSkills(profile.getId()));
        report.setCertifications(certificationService.getStudentCertifications(profile.getId(), null, null));
        report.setCourses(courseService.getStudentCourses(profile.getId(), null, null));
        report.setProjects(projectService.getStudentProjects(profile.getId(), null, null));

        Long targetRoleId = profile.getTargetCareer() != null ? profile.getTargetCareer().getId() : null;
        if (targetRoleId == null) {
            careerRoleRepository.findAll().stream().findFirst().ifPresent(r -> {
                profile.setTargetCareer(r);
            });
            if (profile.getTargetCareer() != null) {
                targetRoleId = profile.getTargetCareer().getId();
            }
        }

        if (targetRoleId != null) {
            report.setTargetCareer(careerRoleService.getRoleById(targetRoleId));
            report.setSkillGapAnalysis(skillGapService.analyzeSkillGap(profile, targetRoleId));
        }

        report.setCareerProgress(skillGapService.getCareerProgress(profile));
        report.setGeneratedAt(LocalDateTime.now());

        return report;
    }
}
