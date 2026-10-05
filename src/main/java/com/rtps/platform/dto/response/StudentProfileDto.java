package com.rtps.platform.dto.response;

import java.time.LocalDateTime;

public class StudentProfileDto {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String studentId;
    private String department;
    private String academicYear;
    private String college;
    private String phone;
    private String bio;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String profileImageUrl;
    private Long targetCareerId;
    private String targetCareerTitle;
    private LocalDateTime registeredAt;

    private int totalSkills;
    private int totalCertifications;
    private int verifiedCertifications;
    private int completedCourses;
    private int completedProjects;

    public StudentProfileDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Long getTargetCareerId() {
        return targetCareerId;
    }

    public void setTargetCareerId(Long targetCareerId) {
        this.targetCareerId = targetCareerId;
    }

    public String getTargetCareerTitle() {
        return targetCareerTitle;
    }

    public void setTargetCareerTitle(String targetCareerTitle) {
        this.targetCareerTitle = targetCareerTitle;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public int getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(int totalSkills) {
        this.totalSkills = totalSkills;
    }

    public int getTotalCertifications() {
        return totalCertifications;
    }

    public void setTotalCertifications(int totalCertifications) {
        this.totalCertifications = totalCertifications;
    }

    public int getVerifiedCertifications() {
        return verifiedCertifications;
    }

    public void setVerifiedCertifications(int verifiedCertifications) {
        this.verifiedCertifications = verifiedCertifications;
    }

    public int getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(int completedCourses) {
        this.completedCourses = completedCourses;
    }

    public int getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(int completedProjects) {
        this.completedProjects = completedProjects;
    }
}
