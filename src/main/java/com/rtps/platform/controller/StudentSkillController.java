package com.rtps.platform.controller;

import com.rtps.platform.dto.request.StudentSkillRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.SkillMasterDto;
import com.rtps.platform.dto.response.StudentSkillDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.StudentProfileService;
import com.rtps.platform.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentSkillController {

    private final StudentSkillService studentSkillService;
    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public StudentSkillController(StudentSkillService studentSkillService,
                                  StudentProfileService studentProfileService,
                                  AuthService authService) {
        this.studentSkillService = studentSkillService;
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping("/api/skills")
    public ResponseEntity<ApiResponse<List<SkillMasterDto>>> getAllMasterSkills() {
        List<SkillMasterDto> skills = studentSkillService.getAllMasterSkills();
        return ResponseEntity.ok(ApiResponse.ok("Master skills catalog", skills));
    }

    @GetMapping("/api/student/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillDto>>> getStudentSkills() {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        List<StudentSkillDto> skills = studentSkillService.getStudentSkills(profile.getId());
        return ResponseEntity.ok(ApiResponse.ok("Student skills retrieved", skills));
    }

    @PostMapping("/api/student/skills")
    public ResponseEntity<ApiResponse<StudentSkillDto>> addSkill(@Valid @RequestBody StudentSkillRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        StudentSkillDto created = studentSkillService.addSkill(profile, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Skill added to profile successfully", created));
    }

    @PutMapping("/api/student/skills/{id}")
    public ResponseEntity<ApiResponse<StudentSkillDto>> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody StudentSkillRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        StudentSkillDto updated = studentSkillService.updateSkill(profile, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Skill updated successfully", updated));
    }

    @DeleteMapping("/api/student/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        studentSkillService.deleteSkill(profile, id);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed from profile", null));
    }
}
