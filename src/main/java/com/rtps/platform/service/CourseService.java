package com.rtps.platform.service;

import com.rtps.platform.dto.request.CourseRequest;
import com.rtps.platform.dto.response.CourseDto;
import com.rtps.platform.entity.Course;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.enums.CourseStatus;
import com.rtps.platform.entity.enums.NotificationType;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    public CourseService(CourseRepository courseRepository, NotificationService notificationService) {
        this.courseRepository = courseRepository;
        this.notificationService = notificationService;
    }

    public List<CourseDto> getStudentCourses(Long studentProfileId, CourseStatus status, String query) {
        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return courseRepository.searchCourses(studentProfileId, status, q)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseDto addCourse(StudentProfile profile, CourseRequest request) {
        CourseStatus status = request.getStatus();
        if (request.getProgressPercentage() >= 100) {
            status = CourseStatus.COMPLETED;
            if (request.getCompletionDate() == null) {
                request.setCompletionDate(LocalDate.now());
            }
        } else if (request.getProgressPercentage() > 0 && status == CourseStatus.NOT_STARTED) {
            status = CourseStatus.IN_PROGRESS;
        }

        Course course = new Course(
                profile,
                request.getTitle().trim(),
                request.getPlatform().trim(),
                request.getInstructor() != null ? request.getInstructor().trim() : null,
                request.getStartDate(),
                request.getCompletionDate(),
                request.getProgressPercentage(),
                request.getCourseUrl() != null ? request.getCourseUrl().trim() : null,
                status
        );

        Course saved = courseRepository.save(course);

        if (status == CourseStatus.COMPLETED) {
            notificationService.createNotification(
                    profile.getUser(),
                    "Course Completed!",
                    "Awesome achievement! You finished the course: " + course.getTitle() + " on " + course.getPlatform() + ".",
                    NotificationType.SUCCESS
            );
        }

        return mapToDto(saved);
    }

    @Transactional
    public CourseDto updateCourse(StudentProfile profile, Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (!course.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to update this course.");
        }

        boolean wasAlreadyCompleted = (course.getStatus() == CourseStatus.COMPLETED);

        course.setTitle(request.getTitle().trim());
        course.setPlatform(request.getPlatform().trim());
        course.setInstructor(request.getInstructor() != null ? request.getInstructor().trim() : null);
        course.setStartDate(request.getStartDate());
        course.setProgressPercentage(request.getProgressPercentage());
        course.setCourseUrl(request.getCourseUrl() != null ? request.getCourseUrl().trim() : null);

        CourseStatus status = request.getStatus();
        if (request.getProgressPercentage() >= 100) {
            status = CourseStatus.COMPLETED;
            if (course.getCompletionDate() == null && request.getCompletionDate() == null) {
                course.setCompletionDate(LocalDate.now());
            } else if (request.getCompletionDate() != null) {
                course.setCompletionDate(request.getCompletionDate());
            }
        } else {
            course.setCompletionDate(request.getCompletionDate());
            if (request.getProgressPercentage() > 0 && (status == null || status == CourseStatus.NOT_STARTED)) {
                status = CourseStatus.IN_PROGRESS;
            }
        }
        course.setStatus(status != null ? status : CourseStatus.NOT_STARTED);

        Course updated = courseRepository.save(course);

        if (!wasAlreadyCompleted && updated.getStatus() == CourseStatus.COMPLETED) {
            notificationService.createNotification(
                    profile.getUser(),
                    "Course Completed!",
                    "Awesome achievement! You finished the course: " + updated.getTitle() + " on " + updated.getPlatform() + ".",
                    NotificationType.SUCCESS
            );
        }

        return mapToDto(updated);
    }

    @Transactional
    public void deleteCourse(StudentProfile profile, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (!course.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to delete this course.");
        }

        courseRepository.delete(course);
    }

    public CourseDto mapToDto(Course c) {
        CourseDto dto = new CourseDto();
        dto.setId(c.getId());
        dto.setStudentProfileId(c.getStudentProfile().getId());
        dto.setTitle(c.getTitle());
        dto.setPlatform(c.getPlatform());
        dto.setInstructor(c.getInstructor());
        dto.setStartDate(c.getStartDate());
        dto.setCompletionDate(c.getCompletionDate());
        dto.setProgressPercentage(c.getProgressPercentage());
        dto.setCourseUrl(c.getCourseUrl());
        dto.setStatus(c.getStatus());
        return dto;
    }
}
