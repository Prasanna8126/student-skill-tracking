package com.rtps.platform.dto.response;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalStudents;
    private long totalCertifications;
    private long verifiedCertifications;
    private long pendingCertifications;
    private long rejectedCertifications;
    private long totalCourses;
    private long totalProjects;

    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> studentsByYear;
    private List<Map<String, Object>> topSkillsAcrossStudents;
    private List<CertificationDto> pendingVerificationQueue;

    public AdminDashboardDto() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCertifications() {
        return totalCertifications;
    }

    public void setTotalCertifications(long totalCertifications) {
        this.totalCertifications = totalCertifications;
    }

    public long getVerifiedCertifications() {
        return verifiedCertifications;
    }

    public void setVerifiedCertifications(long verifiedCertifications) {
        this.verifiedCertifications = verifiedCertifications;
    }

    public long getPendingCertifications() {
        return pendingCertifications;
    }

    public void setPendingCertifications(long pendingCertifications) {
        this.pendingCertifications = pendingCertifications;
    }

    public long getRejectedCertifications() {
        return rejectedCertifications;
    }

    public void setRejectedCertifications(long rejectedCertifications) {
        this.rejectedCertifications = rejectedCertifications;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public Map<String, Long> getStudentsByDepartment() {
        return studentsByDepartment;
    }

    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) {
        this.studentsByDepartment = studentsByDepartment;
    }

    public Map<String, Long> getStudentsByYear() {
        return studentsByYear;
    }

    public void setStudentsByYear(Map<String, Long> studentsByYear) {
        this.studentsByYear = studentsByYear;
    }

    public List<Map<String, Object>> getTopSkillsAcrossStudents() {
        return topSkillsAcrossStudents;
    }

    public void setTopSkillsAcrossStudents(List<Map<String, Object>> topSkillsAcrossStudents) {
        this.topSkillsAcrossStudents = topSkillsAcrossStudents;
    }

    public List<CertificationDto> getPendingVerificationQueue() {
        return pendingVerificationQueue;
    }

    public void setPendingVerificationQueue(List<CertificationDto> pendingVerificationQueue) {
        this.pendingVerificationQueue = pendingVerificationQueue;
    }
}
