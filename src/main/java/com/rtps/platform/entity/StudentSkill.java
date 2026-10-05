package com.rtps.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rtps.platform.entity.enums.SkillLevel;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "student_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "skill_master_id"})
})
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"skills", "certifications", "courses", "projects"})
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_master_id", nullable = false)
    private SkillMaster skillMaster;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level", nullable = false, length = 30)
    private SkillLevel skillLevel = SkillLevel.BEGINNER;

    @Column(nullable = false)
    private int proficiency = 50;

    @Column(name = "date_added", nullable = false)
    private LocalDate dateAdded = LocalDate.now();

    @Column(name = "evidence_url", length = 255)
    private String evidenceUrl;

    public StudentSkill() {
    }

    public StudentSkill(StudentProfile studentProfile, SkillMaster skillMaster, SkillLevel skillLevel, int proficiency, String evidenceUrl) {
        this.studentProfile = studentProfile;
        this.skillMaster = skillMaster;
        this.skillLevel = skillLevel;
        this.proficiency = proficiency;
        this.dateAdded = LocalDate.now();
        this.evidenceUrl = evidenceUrl;
    }

    @PrePersist
    protected void onCreate() {
        if (this.dateAdded == null) {
            this.dateAdded = LocalDate.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public SkillMaster getSkillMaster() {
        return skillMaster;
    }

    public void setSkillMaster(SkillMaster skillMaster) {
        this.skillMaster = skillMaster;
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
