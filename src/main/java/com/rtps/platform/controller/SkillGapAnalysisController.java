package com.rtps.platform.controller;

import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.CareerProgressDto;
import com.rtps.platform.dto.response.DashboardStatsDto;
import com.rtps.platform.dto.response.SkillGapResponse;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.SkillGapService;
import com.rtps.platform.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SkillGapAnalysisController {

    private final SkillGapService skillGapService;
    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public SkillGapAnalysisController(SkillGapService skillGapService,
                                      StudentProfileService studentProfileService,
                                      AuthService authService) {
        this.skillGapService = skillGapService;
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping("/api/career-analysis/{careerId}")
    public ResponseEntity<ApiResponse<SkillGapResponse>> analyzeSkillGap(@PathVariable Long careerId) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        SkillGapResponse response = skillGapService.analyzeSkillGap(profile, careerId);
        return ResponseEntity.ok(ApiResponse.ok("Skill gap analysis calculated", response));
    }

    @GetMapping("/api/career-progress")
    public ResponseEntity<ApiResponse<CareerProgressDto>> getCareerProgress() {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        CareerProgressDto progress = skillGapService.getCareerProgress(profile);
        return ResponseEntity.ok(ApiResponse.ok("Career progress and readiness computed", progress));
    }

    @GetMapping("/api/student/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        DashboardStatsDto stats = skillGapService.getDashboardStats(profile);
        return ResponseEntity.ok(ApiResponse.ok("Student dashboard statistics", stats));
    }
}
