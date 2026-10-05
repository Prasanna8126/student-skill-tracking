package com.rtps.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rtps.platform.entity.enums.SkillLevel;
import jakarta.persistence.*;

@Entity
@Table(name = "career_required_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"career_role_id", "skill_master_id"})
})
public class CareerRequiredSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_role_id", nullable = false)
    @JsonIgnoreProperties({"requiredSkills", "recommendations"})
    private CareerRole careerRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_master_id", nullable = false)
    private SkillMaster skillMaster;

    @Enumerated(EnumType.STRING)
    @Column(name = "minimum_level", nullable = false, length = 30)
    private SkillLevel minimumLevel = SkillLevel.INTERMEDIATE;

    @Column(nullable = false)
    private int weight = 5;

    public CareerRequiredSkill() {
    }

    public CareerRequiredSkill(CareerRole careerRole, SkillMaster skillMaster, SkillLevel minimumLevel, int weight) {
        this.careerRole = careerRole;
        this.skillMaster = skillMaster;
        this.minimumLevel = minimumLevel;
        this.weight = weight;
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
