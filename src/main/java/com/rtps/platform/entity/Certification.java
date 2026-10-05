package com.rtps.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rtps.platform.entity.enums.CertificationStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"skills", "certifications", "courses", "projects"})
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "issuing_organization", nullable = false, length = 150)
    private String issuingOrganization;

    @Column(name = "certificate_id", length = 100)
    private String certificateId;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "credential_url", length = 255)
    private String credentialUrl;

    @Column(name = "certificate_file_path", length = 255)
    private String certificateFilePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CertificationStatus status = CertificationStatus.PENDING;

    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String adminFeedback;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    public Certification() {
    }

    public Certification(StudentProfile studentProfile, String title, String issuingOrganization, String certificateId,
                         LocalDate issueDate, LocalDate expiryDate, String credentialUrl, String certificateFilePath) {
        this.studentProfile = studentProfile;
        this.title = title;
        this.issuingOrganization = issuingOrganization;
        this.certificateId = certificateId;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.credentialUrl = credentialUrl;
        this.certificateFilePath = certificateFilePath;
        this.status = CertificationStatus.PENDING;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIssuingOrganization() {
        return issuingOrganization;
    }

    public void setIssuingOrganization(String issuingOrganization) {
        this.issuingOrganization = issuingOrganization;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }

    public String getCertificateFilePath() {
        return certificateFilePath;
    }

    public void setCertificateFilePath(String certificateFilePath) {
        this.certificateFilePath = certificateFilePath;
    }

    public CertificationStatus getStatus() {
        return status;
    }

    public void setStatus(CertificationStatus status) {
        this.status = status;
    }

    public String getAdminFeedback() {
        return adminFeedback;
    }

    public void setAdminFeedback(String adminFeedback) {
        this.adminFeedback = adminFeedback;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
