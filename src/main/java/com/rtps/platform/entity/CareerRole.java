package com.rtps.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career_roles")
public class CareerRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "department_focus", length = 100)
    private String departmentFocus;

    @OneToMany(mappedBy = "careerRole", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("careerRole")
    private List<CareerRequiredSkill> requiredSkills = new ArrayList<>();

    @OneToMany(mappedBy = "careerRole", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("careerRole")
    private List<Recommendation> recommendations = new ArrayList<>();

    public CareerRole() {
    }

    public CareerRole(String title, String description, String departmentFocus) {
        this.title = title;
        this.description = description;
        this.departmentFocus = departmentFocus;
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

    public List<CareerRequiredSkill> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<CareerRequiredSkill> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<Recommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<Recommendation> recommendations) {
        this.recommendations = recommendations;
    }
}
