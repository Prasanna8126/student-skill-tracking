package com.rtps.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rtps.platform.entity.enums.RecommendationType;
import jakarta.persistence.*;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_role_id", nullable = false)
    @JsonIgnoreProperties({"requiredSkills", "recommendations"})
    private CareerRole careerRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_master_id")
    private SkillMaster skillMaster;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RecommendationType type = RecommendationType.COURSE;

    @Column(nullable = false, length = 100)
    private String provider;

    @Column(length = 255)
    private String url;

    @Column(name = "estimated_duration", length = 50)
    private String estimatedDuration;

    public Recommendation() {
    }

    public Recommendation(CareerRole careerRole, SkillMaster skillMaster, String title, RecommendationType type, String provider, String url, String estimatedDuration) {
        this.careerRole = careerRole;
        this.skillMaster = skillMaster;
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

    public CareerRole getCareerRole() {
        return careerRole;
    }

    public void setCareerRole(CareerRole careerRole) {
        this.careerRole = careerRole;
    }

    public SkillMaster getSkillMaster() {
        return skillMaster;
    }

    public void setSkillMaster(SkillMaster skillMaster) {
        this.skillMaster = skillMaster;
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
