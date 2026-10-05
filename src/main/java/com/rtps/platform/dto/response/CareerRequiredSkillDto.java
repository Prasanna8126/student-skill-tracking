package com.rtps.platform.dto.response;

import com.rtps.platform.entity.enums.SkillLevel;

public class CareerRequiredSkillDto {
    private Long id;
    private Long skillMasterId;
    private String skillName;
    private String category;
    private SkillLevel minimumLevel;
    private int weight;

    public CareerRequiredSkillDto() {
    }

    public CareerRequiredSkillDto(Long id, Long skillMasterId, String skillName, String category, SkillLevel minimumLevel, int weight) {
        this.id = id;
        this.skillMasterId = skillMasterId;
        this.skillName = skillName;
        this.category = category;
        this.minimumLevel = minimumLevel;
        this.weight = weight;
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

    public SkillLevel getMinimumLevel() {
        return minimumLevel;
    }

    public void setMinimumLevel(SkillLevel minimumLevel) {
        this.minimumLevel = minimumLevel;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }
}
