package com.rtps.platform.controller;

import com.rtps.platform.dto.request.CertificationRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.CertificationDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.CertificationService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;
    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public CertificationController(CertificationService certificationService,
                                   StudentProfileService studentProfileService,
                                   AuthService authService) {
        this.certificationService = certificationService;
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificationDto>>> getCertifications(
            @RequestParam(required = false) CertificationStatus status,
            @RequestParam(required = false) String search) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        List<CertificationDto> certs = certificationService.getStudentCertifications(profile.getId(), status, search);
        return ResponseEntity.ok(ApiResponse.ok("Certifications retrieved", certs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CertificationDto>> addCertification(@Valid @RequestBody CertificationRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        CertificationDto created = certificationService.addCertification(profile, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Certification submitted for verification", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationDto>> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        CertificationDto updated = certificationService.updateCertification(profile, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Certification updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        certificationService.deleteCertification(profile, id);
        return ResponseEntity.ok(ApiResponse.ok("Certification deleted", null));
    }
}
