package com.rtps.platform.controller;

import com.rtps.platform.dto.request.CareerRoleRequest;
import com.rtps.platform.dto.request.SkillMasterRequest;
import com.rtps.platform.dto.request.VerifyCertificationRequest;
import com.rtps.platform.dto.response.*;
import com.rtps.platform.entity.SkillMaster;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.SkillMasterRepository;
import com.rtps.platform.service.AdminService;
import com.rtps.platform.service.CareerRoleService;
import com.rtps.platform.service.CertificationService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final StudentProfileService studentProfileService;
    private final CertificationService certificationService;
    private final CareerRoleService careerRoleService;
    private final SkillMasterRepository skillMasterRepository;

    public AdminController(AdminService adminService,
                           StudentProfileService studentProfileService,
                           CertificationService certificationService,
                           CareerRoleService careerRoleService,
                           SkillMasterRepository skillMasterRepository) {
        this.adminService = adminService;
        this.studentProfileService = studentProfileService;
        this.certificationService = certificationService;
        this.careerRoleService = careerRoleService;
        this.skillMasterRepository = skillMasterRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardMetrics() {
        AdminDashboardDto metrics = adminService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard metrics", metrics));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileDto>>> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {
        List<StudentProfileDto> students = adminService.searchStudents(search, department);
        return ResponseEntity.ok(ApiResponse.ok("Students retrieved", students));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getStudentById(@PathVariable Long id) {
        StudentProfileDto student = studentProfileService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.ok("Student details retrieved", student));
    }

    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationDto>>> getAllCertifications(
            @RequestParam(required = false) CertificationStatus status,
            @RequestParam(required = false) String search) {
        List<CertificationDto> certs = certificationService.getAllCertifications(status, search);
        return ResponseEntity.ok(ApiResponse.ok("All certifications", certs));
    }

    @PutMapping("/certifications/{id}/verify")
    public ResponseEntity<ApiResponse<CertificationDto>> verifyCertification(
            @PathVariable Long id,
            @Valid @RequestBody VerifyCertificationRequest request) {
        CertificationDto updated = adminService.verifyCertification(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Certification verification updated", updated));
    }

    @PostMapping("/careers")
    public ResponseEntity<ApiResponse<CareerRoleDto>> createCareerRole(@Valid @RequestBody CareerRoleRequest request) {
        CareerRoleDto created = careerRoleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Career role created successfully", created));
    }

    @PutMapping("/careers/{id}")
    public ResponseEntity<ApiResponse<CareerRoleDto>> updateCareerRole(
            @PathVariable Long id,
            @Valid @RequestBody CareerRoleRequest request) {
        CareerRoleDto updated = careerRoleService.updateRole(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Career role updated successfully", updated));
    }

    @DeleteMapping("/careers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCareerRole(@PathVariable Long id) {
        careerRoleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.ok("Career role deleted", null));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<SkillMasterDto>> createSkillMaster(@Valid @RequestBody SkillMasterRequest request) {
        if (skillMasterRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Skill '" + request.getName() + "' already exists.");
        }
        SkillMaster skill = new SkillMaster(
                request.getName().trim(),
                request.getCategory().trim(),
                request.getDescription()
        );
        SkillMaster saved = skillMasterRepository.save(skill);
        SkillMasterDto dto = new SkillMasterDto(saved.getId(), saved.getName(), saved.getCategory(), saved.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Master skill created", dto));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkillMaster(@PathVariable Long id) {
        SkillMaster skill = skillMasterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skillMasterRepository.delete(skill);
        return ResponseEntity.ok(ApiResponse.ok("Master skill deleted", null));
    }
}
