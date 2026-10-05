package com.rtps.platform.dto.response;

import java.util.List;

public class CareerProgressDto {
    private Long targetCareerId;
    private String targetCareerTitle;
    private String targetCareerDescription;

    private int totalSkillsOwned;
    private int skillsRemainingCount;
    private int skillMatchPercentage;

    private int completedCertifications;
    private int verifiedCertifications;
    private int completedCourses;
    private int completedProjects;

    private int careerReadinessScore; // 0-100% composite readiness
    private String readinessCategory; // "BEGINNER_READY", "JOB_READY", "INTERN_READY", etc.

    private List<SkillItemDto> acquiredSkills;
    private List<SkillItemDto> pendingSkills;

    public CareerProgressDto() {
    }

    public Long getTargetCareerId() {
        return targetCareerId;
    }

    public void setTargetCareerId(Long targetCareerId) {
        this.targetCareerId = targetCareerId;
    }

    public String getTargetCareerTitle() {
        return targetCareerTitle;
    }

    public void setTargetCareerTitle(String targetCareerTitle) {
        this.targetCareerTitle = targetCareerTitle;
    }

    public String getTargetCareerDescription() {
        return targetCareerDescription;
    }

    public void setTargetCareerDescription(String targetCareerDescription) {
        this.targetCareerDescription = targetCareerDescription;
    }

    public int getTotalSkillsOwned() {
        return totalSkillsOwned;
    }

    public void setTotalSkillsOwned(int totalSkillsOwned) {
        this.totalSkillsOwned = totalSkillsOwned;
    }

    public int getSkillsRemainingCount() {
        return skillsRemainingCount;
    }

    public void setSkillsRemainingCount(int skillsRemainingCount) {
        this.skillsRemainingCount = skillsRemainingCount;
    }

    public int getSkillMatchPercentage() {
        return skillMatchPercentage;
    }

    public void setSkillMatchPercentage(int skillMatchPercentage) {
        this.skillMatchPercentage = skillMatchPercentage;
    }

    public int getCompletedCertifications() {
        return completedCertifications;
    }

    public void setCompletedCertifications(int completedCertifications) {
        this.completedCertifications = completedCertifications;
    }

    public int getVerifiedCertifications() {
        return verifiedCertifications;
    }

    public void setVerifiedCertifications(int verifiedCertifications) {
        this.verifiedCertifications = verifiedCertifications;
    }

    public int getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(int completedCourses) {
        this.completedCourses = completedCourses;
    }

    public int getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(int completedProjects) {
        this.completedProjects = completedProjects;
    }

    public int getCareerReadinessScore() {
        return careerReadinessScore;
    }

    public void setCareerReadinessScore(int careerReadinessScore) {
        this.careerReadinessScore = careerReadinessScore;
    }

    public String getReadinessCategory() {
        return readinessCategory;
    }

    public void setReadinessCategory(String readinessCategory) {
        this.readinessCategory = readinessCategory;
    }

    public List<SkillItemDto> getAcquiredSkills() {
        return acquiredSkills;
    }

    public void setAcquiredSkills(List<SkillItemDto> acquiredSkills) {
        this.acquiredSkills = acquiredSkills;
    }

    public List<SkillItemDto> getPendingSkills() {
        return pendingSkills;
    }

    public void setPendingSkills(List<SkillItemDto> pendingSkills) {
        this.pendingSkills = pendingSkills;
    }
}
