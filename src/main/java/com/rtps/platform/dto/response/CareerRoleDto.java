package com.rtps.platform.dto.response;

import java.util.ArrayList;
import java.util.List;

public class CareerRoleDto {
    private Long id;
    private String title;
    private String description;
    private String departmentFocus;
    private List<CareerRequiredSkillDto> requiredSkills = new ArrayList<>();
    private List<RecommendationDto> recommendations = new ArrayList<>();

    public CareerRoleDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartmentFocus() {
        return departmentFocus;
    }

    public void setDepartmentFocus(String departmentFocus) {
        this.departmentFocus = departmentFocus;
    }

    public List<CareerRequiredSkillDto> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<CareerRequiredSkillDto> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<RecommendationDto> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationDto> recommendations) {
        this.recommendations = recommendations;
    }
}
