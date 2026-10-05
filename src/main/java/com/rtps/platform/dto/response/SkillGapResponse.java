package com.rtps.platform.dto.response;

import java.util.ArrayList;
import java.util.List;

public class SkillGapResponse {
    private Long careerRoleId;
    private String careerRoleTitle;
    private String careerRoleDescription;
    private int skillMatchPercentage;
    private int totalRequiredSkills;

    private List<SkillItemDto> alreadyAcquired = new ArrayList<>();
    private List<SkillItemDto> needsImprovement = new ArrayList<>();
    private List<SkillItemDto> missingSkills = new ArrayList<>();

    private List<RecommendationDto> recommendedCourses = new ArrayList<>();
    private List<RecommendationDto> recommendedCertifications = new ArrayList<>();

    public SkillGapResponse() {
    }

    public Long getCareerRoleId() {
        return careerRoleId;
    }

    public void setCareerRoleId(Long careerRoleId) {
        this.careerRoleId = careerRoleId;
    }

    public String getCareerRoleTitle() {
        return careerRoleTitle;
    }

    public void setCareerRoleTitle(String careerRoleTitle) {
        this.careerRoleTitle = careerRoleTitle;
    }

    public String getCareerRoleDescription() {
        return careerRoleDescription;
    }

    public void setCareerRoleDescription(String careerRoleDescription) {
        this.careerRoleDescription = careerRoleDescription;
    }

    public int getSkillMatchPercentage() {
        return skillMatchPercentage;
    }

    public void setSkillMatchPercentage(int skillMatchPercentage) {
        this.skillMatchPercentage = skillMatchPercentage;
    }

    public int getTotalRequiredSkills() {
        return totalRequiredSkills;
    }

    public void setTotalRequiredSkills(int totalRequiredSkills) {
        this.totalRequiredSkills = totalRequiredSkills;
    }

    public List<SkillItemDto> getAlreadyAcquired() {
        return alreadyAcquired;
    }

    public void setAlreadyAcquired(List<SkillItemDto> alreadyAcquired) {
        this.alreadyAcquired = alreadyAcquired;
    }

    public List<SkillItemDto> getNeedsImprovement() {
        return needsImprovement;
    }

    public void setNeedsImprovement(List<SkillItemDto> needsImprovement) {
        this.needsImprovement = needsImprovement;
    }

    public List<SkillItemDto> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<SkillItemDto> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<RecommendationDto> getRecommendedCourses() {
        return recommendedCourses;
    }

    public void setRecommendedCourses(List<RecommendationDto> recommendedCourses) {
        this.recommendedCourses = recommendedCourses;
    }

    public List<RecommendationDto> getRecommendedCertifications() {
        return recommendedCertifications;
    }

    public void setRecommendedCertifications(List<RecommendationDto> recommendedCertifications) {
        this.recommendedCertifications = recommendedCertifications;
    }
}
