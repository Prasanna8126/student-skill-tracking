package com.rtps.platform.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class StudentCareerReportDto {
    private StudentProfileDto profile;
    private List<StudentSkillDto> skills;
    private List<CertificationDto> certifications;
    private List<CourseDto> courses;
    private List<ProjectDto> projects;
    private CareerRoleDto targetCareer;
    private SkillGapResponse skillGapAnalysis;
    private CareerProgressDto careerProgress;
    private LocalDateTime generatedAt;

    public StudentCareerReportDto() {
        this.generatedAt = LocalDateTime.now();
    }

    public StudentProfileDto getProfile() {
        return profile;
    }

    public void setProfile(StudentProfileDto profile) {
        this.profile = profile;
    }

    public List<StudentSkillDto> getSkills() {
        return skills;
    }

    public void setSkills(List<StudentSkillDto> skills) {
        this.skills = skills;
    }

    public List<CertificationDto> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationDto> certifications) {
        this.certifications = certifications;
    }

    public List<CourseDto> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseDto> courses) {
        this.courses = courses;
    }

    public List<ProjectDto> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDto> projects) {
        this.projects = projects;
    }

    public CareerRoleDto getTargetCareer() {
        return targetCareer;
    }

    public void setTargetCareer(CareerRoleDto targetCareer) {
        this.targetCareer = targetCareer;
    }

    public SkillGapResponse getSkillGapAnalysis() {
        return skillGapAnalysis;
    }

    public void setSkillGapAnalysis(SkillGapResponse skillGapAnalysis) {
        this.skillGapAnalysis = skillGapAnalysis;
    }

    public CareerProgressDto getCareerProgress() {
        return careerProgress;
    }

    public void setCareerProgress(CareerProgressDto careerProgress) {
        this.careerProgress = careerProgress;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
