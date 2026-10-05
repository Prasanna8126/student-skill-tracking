package com.rtps.platform.service;

import com.rtps.platform.dto.request.VerifyCertificationRequest;
import com.rtps.platform.dto.response.AdminDashboardDto;
import com.rtps.platform.dto.response.CertificationDto;
import com.rtps.platform.dto.response.StudentProfileDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.entity.enums.Role;
import com.rtps.platform.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final CertificationRepository certificationRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final CertificationService certificationService;
    private final StudentProfileService studentProfileService;

    public AdminService(UserRepository userRepository,
                        StudentProfileRepository studentProfileRepository,
                        StudentSkillRepository studentSkillRepository,
                        CertificationRepository certificationRepository,
                        CourseRepository courseRepository,
                        ProjectRepository projectRepository,
                        CertificationService certificationService,
                        StudentProfileService studentProfileService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.certificationRepository = certificationRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
        this.certificationService = certificationService;
        this.studentProfileService = studentProfileService;
    }

    public AdminDashboardDto getDashboardMetrics() {
        AdminDashboardDto dto = new AdminDashboardDto();

        dto.setTotalStudents(userRepository.countByRole(Role.ROLE_STUDENT));
        dto.setTotalCertifications(certificationRepository.count());
        dto.setVerifiedCertifications(certificationRepository.countByStatus(CertificationStatus.VERIFIED));
        dto.setPendingCertifications(certificationRepository.countByStatus(CertificationStatus.PENDING));
        dto.setRejectedCertifications(certificationRepository.countByStatus(CertificationStatus.REJECTED));
        dto.setTotalCourses(courseRepository.count());
        dto.setTotalProjects(projectRepository.count());

        // Students by department
        Map<String, Long> byDept = new HashMap<>();
        List<Object[]> deptResults = studentProfileRepository.countStudentsByDepartment();
        for (Object[] r : deptResults) {
            String dept = r[0] != null ? (String) r[0] : "Unassigned";
            Long count = (Long) r[1];
            byDept.put(dept, count);
        }
        dto.setStudentsByDepartment(byDept);

        // Students by year
        Map<String, Long> byYear = new HashMap<>();
        List<Object[]> yearResults = studentProfileRepository.countStudentsByAcademicYear();
        for (Object[] r : yearResults) {
            String year = r[0] != null ? (String) r[0] : "Unassigned";
            Long count = (Long) r[1];
            byYear.put(year, count);
        }
        dto.setStudentsByYear(byYear);

        // Top skills across students
        List<Map<String, Object>> topSkills = new ArrayList<>();
        List<Object[]> skillResults = studentSkillRepository.findTopSkillsAcrossStudents();
        for (int i = 0; i < Math.min(8, skillResults.size()); i++) {
            Object[] r = skillResults.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("skill", r[0]);
            map.put("count", r[1]);
            topSkills.add(map);
        }
        dto.setTopSkillsAcrossStudents(topSkills);

        // Pending verification queue
        List<CertificationDto> pendingQueue = certificationService.getAllCertifications(CertificationStatus.PENDING, null);
        dto.setPendingVerificationQueue(pendingQueue);

        return dto;
    }

    public List<StudentProfileDto> searchStudents(String query, String department) {
        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String dept = (department != null && !department.trim().isEmpty()) ? department.trim() : null;

        List<StudentProfile> profiles = studentProfileRepository.searchStudents(q, dept);
        return profiles.stream()
                .map(studentProfileService::mapToDto)
                .collect(Collectors.toList());
    }

    public CertificationDto verifyCertification(Long certId, VerifyCertificationRequest request) {
        return certificationService.verifyCertification(certId, request);
    }
}
