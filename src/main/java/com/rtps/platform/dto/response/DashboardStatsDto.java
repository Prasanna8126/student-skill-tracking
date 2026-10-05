package com.rtps.platform.dto.response;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private String studentName;
    private String studentEmail;
    private String studentId;
    private String department;
    private String targetCareerTitle;

    private int totalSkills;
    private int totalCertifications;
    private int verifiedCertifications;
    private int pendingCertifications;
    private int coursesCompleted;
    private int totalCourses;
    private int projectsCompleted;
    private int totalProjects;

    private int overallLearningProgress; // 0-100%
    private int careerSkillMatch;        // 0-100%

    private List<CertificationDto> recentCertifications;
    private List<ProjectDto> recentProjects;
    private List<CourseDto> inProgressCourses;

    private Map<String, Integer> skillsByCategory;
    private Map<String, Integer> skillsByLevel;

    public DashboardStatsDto() {
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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

    public String getTargetCareerTitle() {
        return targetCareerTitle;
    }

    public void setTargetCareerTitle(String targetCareerTitle) {
        this.targetCareerTitle = targetCareerTitle;
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

    public int getPendingCertifications() {
        return pendingCertifications;
    }

    public void setPendingCertifications(int pendingCertifications) {
        this.pendingCertifications = pendingCertifications;
    }

    public int getCoursesCompleted() {
        return coursesCompleted;
    }

    public void setCoursesCompleted(int coursesCompleted) {
        this.coursesCompleted = coursesCompleted;
    }

    public int getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }

    public int getProjectsCompleted() {
        return projectsCompleted;
    }

    public void setProjectsCompleted(int projectsCompleted) {
        this.projectsCompleted = projectsCompleted;
    }

    public int getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(int totalProjects) {
        this.totalProjects = totalProjects;
    }

    public int getOverallLearningProgress() {
        return overallLearningProgress;
    }

    public void setOverallLearningProgress(int overallLearningProgress) {
        this.overallLearningProgress = overallLearningProgress;
    }

    public int getCareerSkillMatch() {
        return careerSkillMatch;
    }

    public void setCareerSkillMatch(int careerSkillMatch) {
        this.careerSkillMatch = careerSkillMatch;
    }

    public List<CertificationDto> getRecentCertifications() {
        return recentCertifications;
    }

    public void setRecentCertifications(List<CertificationDto> recentCertifications) {
        this.recentCertifications = recentCertifications;
    }

    public List<ProjectDto> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<ProjectDto> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<CourseDto> getInProgressCourses() {
        return inProgressCourses;
    }

    public void setInProgressCourses(List<CourseDto> inProgressCourses) {
        this.inProgressCourses = inProgressCourses;
    }

    public Map<String, Integer> getSkillsByCategory() {
        return skillsByCategory;
    }

    public void setSkillsByCategory(Map<String, Integer> skillsByCategory) {
        this.skillsByCategory = skillsByCategory;
    }

    public Map<String, Integer> getSkillsByLevel() {
        return skillsByLevel;
    }

    public void setSkillsByLevel(Map<String, Integer> skillsByLevel) {
        this.skillsByLevel = skillsByLevel;
    }
}
