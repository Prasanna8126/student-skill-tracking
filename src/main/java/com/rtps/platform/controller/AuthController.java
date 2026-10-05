package com.rtps.platform.controller;

import com.rtps.platform.dto.request.LoginRequest;
import com.rtps.platform.dto.request.RegisterRequest;
import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.dto.response.AuthResponse;
import com.rtps.platform.dto.response.StudentProfileDto;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.Role;
import com.rtps.platform.service.AuthService;
import com.rtps.platform.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final StudentProfileService studentProfileService;

    public AuthController(AuthService authService, StudentProfileService studentProfileService) {
        this.authService = authService;
        this.studentProfileService = studentProfileService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful! Welcome to the career portal.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user.getRole() == Role.ROLE_STUDENT) {
            StudentProfileDto profileDto = studentProfileService.getProfileForUser(user);
            return ResponseEntity.ok(ApiResponse.ok("Authenticated student", profileDto));
        } else {
            return ResponseEntity.ok(ApiResponse.ok("Authenticated administrator", user));
        }
    }
}
