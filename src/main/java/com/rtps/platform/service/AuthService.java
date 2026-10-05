package com.rtps.platform.service;

import com.rtps.platform.dto.request.LoginRequest;
import com.rtps.platform.dto.request.RegisterRequest;
import com.rtps.platform.dto.response.AuthResponse;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.NotificationType;
import com.rtps.platform.entity.enums.Role;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.StudentProfileRepository;
import com.rtps.platform.repository.UserRepository;
import com.rtps.platform.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(Role.ROLE_STUDENT);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        StudentProfile profile = new StudentProfile(savedUser);
        profile.setStudentId(request.getStudentId());
        profile.setDepartment(request.getDepartment());
        profile.setAcademicYear(request.getAcademicYear());
        profile.setCollege(request.getCollege());
        StudentProfile savedProfile = studentProfileRepository.save(profile);

        // Send welcome notification
        notificationService.createNotification(
                savedUser,
                "Welcome to Career Track!",
                "Welcome to your student career & skill tracking dashboard. Start by adding your skills and choosing a target career role.",
                NotificationType.SUCCESS
        );

        // Authenticate and issue token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name(),
                savedProfile.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long studentProfileId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentProfileId = studentProfileRepository.findByUserId(user.getId())
                    .map(StudentProfile::getId)
                    .orElse(null);
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                studentProfileId
        );
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("No authenticated user in context.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));
    }
}
