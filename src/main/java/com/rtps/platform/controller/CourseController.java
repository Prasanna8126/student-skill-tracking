package com.rtps.platform.controller;

import com.rtps.platform.dto.request.CourseRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.CourseDto;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.CourseStatus;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.CourseService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final StudentProfileService studentProfileService;
    private final AuthService authService;

    public CourseController(CourseService courseService,
                            StudentProfileService studentProfileService,
                            AuthService authService) {
        this.courseService = courseService;
        this.studentProfileService = studentProfileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDto>>> getCourses(
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String search) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        List<CourseDto> courses = courseService.getStudentCourses(profile.getId(), status, search);
        return ResponseEntity.ok(ApiResponse.ok("Courses retrieved", courses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseDto>> addCourse(@Valid @RequestBody CourseRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        CourseDto created = courseService.addCourse(profile, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Course added successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        CourseDto updated = courseService.updateCourse(profile, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Course updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        StudentProfile profile = studentProfileService.getOrCreateProfileForUser(user);
        courseService.deleteCourse(profile, id);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted", null));
    }
}
