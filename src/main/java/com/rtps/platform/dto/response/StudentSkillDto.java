package com.rtps.platform.dto.response;

import com.rtps.platform.entity.enums.SkillLevel;
import java.time.LocalDate;

public class StudentSkillDto {
    private Long id;
    private Long skillMasterId;
    private String skillName;
    private String category;
    private String description;
    private SkillLevel skillLevel;
    private int proficiency;
    private LocalDate dateAdded;
    private String evidenceUrl;

    public StudentSkillDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }
}
