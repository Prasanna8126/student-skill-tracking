package com.rtps.platform.dto.response;

import com.rtps.platform.entity.enums.SkillLevel;

public class SkillItemDto {
    private Long skillMasterId;
    private String skillName;
    private String category;
    private SkillLevel requiredLevel;
    private SkillLevel studentLevel;
    private int currentProficiency;
    private int requiredProficiency;
    private int weight;
    private String status; // "ACQUIRED", "NEEDS_IMPROVEMENT", "MISSING"

    public SkillItemDto() {
    }

    public SkillItemDto(Long skillMasterId, String skillName, String category,
                        SkillLevel requiredLevel, SkillLevel studentLevel,
                        int currentProficiency, int requiredProficiency,
                        int weight, String status) {
        this.skillMasterId = skillMasterId;
        this.skillName = skillName;
        this.category = category;
        this.requiredLevel = requiredLevel;
        this.studentLevel = studentLevel;
        this.currentProficiency = currentProficiency;
        this.requiredProficiency = requiredProficiency;
        this.weight = weight;
        this.status = status;
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

    public SkillLevel getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(SkillLevel requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public SkillLevel getStudentLevel() {
        return studentLevel;
    }

    public void setStudentLevel(SkillLevel studentLevel) {
        this.studentLevel = studentLevel;
    }

    public int getCurrentProficiency() {
        return currentProficiency;
    }

    public void setCurrentProficiency(int currentProficiency) {
        this.currentProficiency = currentProficiency;
    }

    public int getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(int requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
