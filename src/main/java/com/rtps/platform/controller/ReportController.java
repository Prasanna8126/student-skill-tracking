package com.rtps.platform.controller;

import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.StudentCareerReportDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.StudentProfileRepository;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.ReportService;
import com.rtps.platform.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final StudentProfileService studentProfileService;
    private final StudentProfileRepository studentProfileRepository;
    private final AuthService authService;

    public ReportController(ReportService reportService,
                            StudentProfileService studentProfileService,
                            StudentProfileRepository studentProfileRepository,
                            AuthService authService) {
        this.reportService = reportService;
        this.studentProfileService = studentProfileService;
        this.studentProfileRepository = studentProfileRepository;
        this.authService = authService;
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<StudentCareerReportDto>> getMyReport() {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        StudentCareerReportDto report = reportService.generateStudentReport(profile);
        return ResponseEntity.ok(ApiResponse.ok("Student career report generated", report));
    }

    @GetMapping("/student/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StudentCareerReportDto>> getStudentReportById(@PathVariable Long id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + id));
        StudentCareerReportDto report = reportService.generateStudentReport(profile);
        return ResponseEntity.ok(ApiResponse.ok("Student career report generated", report));
    }
}
