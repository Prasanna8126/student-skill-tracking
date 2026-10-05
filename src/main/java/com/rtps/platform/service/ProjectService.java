package com.rtps.platform.service;

import com.rtps.platform.dto.request.ProjectRequest;
import com.rtps.platform.dto.response.ProjectDto;
import com.rtps.platform.entity.Project;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.enums.NotificationType;
import com.rtps.platform.entity.enums.ProjectStatus;
import com.rtps.platform.exception.BadRequestException;
import com.rtps.platform.exception.ResourceNotFoundException;
import com.rtps.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    public ProjectService(ProjectRepository projectRepository, NotificationService notificationService) {
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
    }

    public List<ProjectDto> getStudentProjects(Long studentProfileId, ProjectStatus status, String query) {
        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return projectRepository.searchProjects(studentProfileId, status, q)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto addProject(StudentProfile profile, ProjectRequest request) {
        ProjectStatus status = request.getStatus() != null ? request.getStatus() : ProjectStatus.IN_PROGRESS;
        if (status == ProjectStatus.COMPLETED && request.getCompletionDate() == null) {
            request.setCompletionDate(LocalDate.now());
        }

        Project project = new Project(
                profile,
                request.getTitle().trim(),
                request.getDescription(),
                request.getTechnologiesUsed(),
                request.getCategory(),
                request.getStartDate(),
                request.getCompletionDate(),
                request.getGithubUrl() != null ? request.getGithubUrl().trim() : null,
                request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null,
                status
        );

        Project saved = projectRepository.save(project);

        if (status == ProjectStatus.COMPLETED) {
            notificationService.createNotification(
                    profile.getUser(),
                    "Project Completed!",
                    "Great work on completing your project: " + project.getTitle() + "!",
                    NotificationType.SUCCESS
            );
        }

        return mapToDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(StudentProfile profile, Long projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to update this project.");
        }

        boolean wasAlreadyCompleted = (project.getStatus() == ProjectStatus.COMPLETED);

        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription());
        project.setTechnologiesUsed(request.getTechnologiesUsed());
        project.setCategory(request.getCategory());
        project.setStartDate(request.getStartDate());
        project.setCompletionDate(request.getCompletionDate());
        project.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : null);
        project.setLiveDemoUrl(request.getLiveDemoUrl() != null ? request.getLiveDemoUrl().trim() : null);

        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
            if (request.getStatus() == ProjectStatus.COMPLETED && project.getCompletionDate() == null) {
                project.setCompletionDate(LocalDate.now());
            }
        }

        Project updated = projectRepository.save(project);

        if (!wasAlreadyCompleted && updated.getStatus() == ProjectStatus.COMPLETED) {
            notificationService.createNotification(
                    profile.getUser(),
                    "Project Completed!",
                    "Great work on completing your project: " + updated.getTitle() + "!",
                    NotificationType.SUCCESS
            );
        }

        return mapToDto(updated);
    }

    @Transactional
    public void deleteProject(StudentProfile profile, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to delete this project.");
        }

        projectRepository.delete(project);
    }

    public ProjectDto mapToDto(Project p) {
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        dto.setStudentProfileId(p.getStudentProfile().getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setTechnologiesUsed(p.getTechnologiesUsed());
        dto.setCategory(p.getCategory());
        dto.setStartDate(p.getStartDate());
        dto.setCompletionDate(p.getCompletionDate());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setLiveDemoUrl(p.getLiveDemoUrl());
        dto.setStatus(p.getStatus());
        return dto;
    }
}
