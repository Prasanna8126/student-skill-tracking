package com.rtps.platform.dto.request;

import com.rtps.platform.entity.enums.SkillLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StudentSkillRequest {

    private Long skillMasterId;

    // Optional skill name if creating a custom skill on-the-fly
    private String skillName;
    private String category;

    @NotNull(message = "Skill level is required")
    private SkillLevel skillLevel;

    @Min(value = 0, message = "Proficiency must be at least 0%")
    @Max(value = 100, message = "Proficiency cannot exceed 100%")
    private int proficiency = 50;

    private String evidenceUrl;

    public StudentSkillRequest() {
    }

    public Long getSkillMasterId() {
        return skillMasterId;
    }

    public void setSkillMasterId(Long skillMasterId) {
        this.skillMasterId = skillMasterId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public SkillLevel getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }

    public int getProficiency() {
        return proficiency;
    }

    public void setProficiency(int proficiency) {
        this.proficiency = proficiency;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }
}
