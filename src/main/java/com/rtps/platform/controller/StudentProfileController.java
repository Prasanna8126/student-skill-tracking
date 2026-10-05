package com.rtps.platform.controller;

import com.rtps.platform.dto.request.StudentProfileRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.StudentProfileDto;
import com.rtps.platform.entity.User;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public StudentProfileController(StudentProfileService studentProfileService, AuthService authService) {
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfileDto dto = studentProfileService.getProfileForUser(user);
        return ResponseEntity.ok(ApiResponse.ok("Student profile retrieved", dto));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(@Valid @RequestBody StudentProfileRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfileDto updated = studentProfileService.updateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PutMapping("/target-career/{careerId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> setTargetCareer(@PathVariable Long careerId) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfileRequest req = new StudentProfileRequest();
        req.setTargetCareerId(careerId);
        StudentProfileDto updated = studentProfileService.updateProfile(user, req);
        return ResponseEntity.ok(ApiResponse.ok("Target career role updated", updated));
    }
}
