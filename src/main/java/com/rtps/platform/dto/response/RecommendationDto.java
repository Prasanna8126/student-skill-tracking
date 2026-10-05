package com.rtps.platform.dto.response;

import com.rtps.platform.entity.enums.RecommendationType;

public class RecommendationDto {
    private Long id;
    private Long careerRoleId;
    private Long skillMasterId;
    private String skillName;
    private String title;
    private RecommendationType type;
    private String provider;
    private String url;
    private String estimatedDuration;

    public RecommendationDto() {
    }

    public RecommendationDto(Long id, Long careerRoleId, Long skillMasterId, String skillName,
                             String title, RecommendationType type, String provider, String url, String estimatedDuration) {
        this.id = id;
        this.careerRoleId = careerRoleId;
        this.skillMasterId = skillMasterId;
        this.skillName = skillName;
        this.title = title;
        this.type = type;
        this.provider = provider;
        this.url = url;
        this.estimatedDuration = estimatedDuration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCareerRoleId() {
        return careerRoleId;
    }

    public void setCareerRoleId(Long careerRoleId) {
        this.careerRoleId = careerRoleId;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public RecommendationType getType() {
        return type;
    }

    public void setType(RecommendationType type) {
        this.type = type;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
}
