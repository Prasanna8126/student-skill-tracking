package com.rtps.platform.controller;

import com.rtps.platform.dto.request.ProjectRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.ProjectDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.ProjectStatus;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.ProjectService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public ProjectController(ProjectService projectService,
                             StudentProfileService studentProfileService,
                             AuthService authService) {
        this.projectService = projectService;
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String search) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        List<ProjectDto> projects = projectService.getStudentProjects(profile.getId(), status, search);
        return ResponseEntity.ok(ApiResponse.ok("Projects retrieved", projects));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> addProject(@Valid @RequestBody ProjectRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        ProjectDto created = projectService.addProject(profile, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Project added to portfolio", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        ProjectDto updated = projectService.updateProject(profile, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Project updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        projectService.deleteProject(profile, id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted", null));
    }
}
