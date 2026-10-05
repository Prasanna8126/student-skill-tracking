package com.rtps.platform;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rtps.platform.dto.request.*;
import com.rtps.platform.dto.response.AuthResponse;
import com.rtps.platform.dto.response.CertificationDto;
import com.rtps.platform.entity.CareerRole;
import com.rtps.platform.entity.enums.CertificationStatus;
import com.rtps.platform.entity.enums.CourseStatus;
import com.rtps.platform.entity.enums.ProjectStatus;
import com.rtps.platform.entity.enums.SkillLevel;
import com.rtps.platform.repository.CareerRoleRepository;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FullWorkflowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    private static String studentToken;
    private static String adminToken;
    private static Long createdCertId;

    @Test
    @Order(1)
    void testStudentRegistrationAndLogin() throws Exception {
        // Register new student
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setFullName("Integration Test Student");
        registerReq.setEmail("itest.student@university.edu");
        registerReq.setPassword("Password@123");
        registerReq.setStudentId("STU-ITEST-01");
        registerReq.setDepartment("Computer Science");
        registerReq.setAcademicYear("3rd Year");

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andReturn();

        String regJson = regResult.getResponse().getContentAsString();
        studentToken = objectMapper.readTree(regJson).path("data").path("token").asText();
        assertNotNull(studentToken);

        // Login as Admin
        LoginRequest adminLogin = new LoginRequest();
        adminLogin.setEmail("admin@system.com");
        adminLogin.setPassword("Admin@123");

        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String adminJson = adminResult.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(adminJson).path("data").path("token").asText();
        assertNotNull(adminToken);
    }

    @Test
    @Order(2)
    void testUpdateProfileAndTargetCareer() throws Exception {
        CareerRole role = careerRoleRepository.findByTitleIgnoreCase("Java Developer").orElseThrow();

        StudentProfileRequest profileReq = new StudentProfileRequest();
        profileReq.setFullName("Integration Test Student (Updated)");
        profileReq.setBio("Updated bio for integration testing");
        profileReq.setTargetCareerId(role.getId());

        mockMvc.perform(put("/api/students/profile")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.bio").value("Updated bio for integration testing"))
                .andExpect(jsonPath("$.data.targetCareerTitle").value("Java Developer"));
    }

    @Test
    @Order(3)
    void testAddSkill() throws Exception {
        StudentSkillRequest skillReq = new StudentSkillRequest();
        skillReq.setSkillName("Java");
        skillReq.setSkillLevel(SkillLevel.ADVANCED);
        skillReq.setProficiency(88);
        skillReq.setEvidenceUrl("https://github.com/itest/java");

        mockMvc.perform(post("/api/student/skills")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(skillReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.skillName").value("Java"))
                .andExpect(jsonPath("$.data.proficiency").value(88));
    }

    @Test
    @Order(4)
    void testAddCertificationAndAdminVerification() throws Exception {
        // Student adds certification
        CertificationRequest certReq = new CertificationRequest();
        certReq.setTitle("AWS Certified Cloud Practitioner");
        certReq.setIssuingOrganization("Amazon Web Services");
        certReq.setIssueDate(LocalDate.now().minusMonths(1));
        certReq.setCredentialUrl("https://aws.amazon.com/verify");

        MvcResult certResult = mockMvc.perform(post("/api/certifications")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(certReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn();

        String certJson = certResult.getResponse().getContentAsString();
        createdCertId = objectMapper.readTree(certJson).path("data").path("id").asLong();
        assertTrue(createdCertId > 0);

        // Admin verifies certification
        VerifyCertificationRequest verifyReq = new VerifyCertificationRequest(CertificationStatus.VERIFIED, "Credential verified via official AWS validator.");

        mockMvc.perform(put("/api/admin/certifications/" + createdCertId + "/verify")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("VERIFIED"));
    }

    @Test
    @Order(5)
    void testAddCourseAndProject() throws Exception {
        // Add course
        CourseRequest courseReq = new CourseRequest();
        courseReq.setTitle("Spring Boot 3 Masterclass");
        courseReq.setPlatform("Udemy");
        courseReq.setProgressPercentage(100);
        courseReq.setStatus(CourseStatus.COMPLETED);

        mockMvc.perform(post("/api/courses")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(courseReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        // Add project
        ProjectRequest projReq = new ProjectRequest();
        projReq.setTitle("Full Stack Student Portal");
        projReq.setCategory("Web Application");
        projReq.setTechnologiesUsed("Java, Spring Boot, JPA, REST");
        projReq.setStatus(ProjectStatus.COMPLETED);

        mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(projReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    @Order(6)
    void testSkillGapAnalysisAndCareerReport() throws Exception {
        CareerRole role = careerRoleRepository.findByTitleIgnoreCase("Java Developer").orElseThrow();

        // Skill Gap Analysis
        mockMvc.perform(get("/api/career-analysis/" + role.getId())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.careerRoleTitle").value("Java Developer"))
                .andExpect(jsonPath("$.data.skillMatchPercentage").isNumber())
                .andExpect(jsonPath("$.data.alreadyAcquired").isArray())
                .andExpect(jsonPath("$.data.missingSkills").isArray())
                .andExpect(jsonPath("$.data.recommendedCourses").isArray());

        // Career Progress
        mockMvc.perform(get("/api/career-progress")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.careerReadinessScore").isNumber());

        // Student Career Report
        mockMvc.perform(get("/api/reports/student")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.profile.fullName").isNotEmpty())
                .andExpect(jsonPath("$.data.skills").isArray())
                .andExpect(jsonPath("$.data.certifications").isArray());
    }

    @Test
    @Order(7)
    void testRoleBasedAccessSecurity() throws Exception {
        // Student attempting to access Admin endpoint must receive 403 Forbidden
        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Admin attempting to access Admin endpoint must receive 200 OK
        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
