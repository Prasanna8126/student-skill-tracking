package com.rtps.platform;

import com.rtps.platform.dto.response.SkillGapResponse;
import com.rtps.platform.entity.CareerRole;
import com.rtps.platform.entity.StudentProfile;
import com.rtps.platform.entity.User;
import com.rtps.platform.entity.enums.Role;
import com.rtps.platform.repository.CareerRoleRepository;
import com.rtps.platform.repository.StudentProfileRepository;
import com.rtps.platform.repository.UserRepository;
import com.rtps.platform.service.SkillGapService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SkillGapServiceTest {

    @Autowired
    private SkillGapService skillGapService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @Test
    void testSkillGapAnalysisForJohnDoe() {
        User john = userRepository.findByEmail("john.doe@university.edu").orElseThrow();
        StudentProfile profile = studentProfileRepository.findByUserId(john.getId()).orElseThrow();
        CareerRole javaDev = careerRoleRepository.findByTitleIgnoreCase("Java Developer").orElseThrow();

        SkillGapResponse response = skillGapService.analyzeSkillGap(profile, javaDev.getId());

        assertNotNull(response);
        assertEquals("Java Developer", response.getCareerRoleTitle());
        assertTrue(response.getSkillMatchPercentage() > 0 && response.getSkillMatchPercentage() <= 100);

        // John has Java, SQL, Git/GitHub, Data Structures in seed data
        assertFalse(response.getAlreadyAcquired().isEmpty(), "Should have acquired skills");
        assertFalse(response.getMissingSkills().isEmpty(), "Should have missing skills like Spring Boot or REST API");

        // Should have recommendations populated
        assertFalse(response.getRecommendedCourses().isEmpty() && response.getRecommendedCertifications().isEmpty(),
                "Recommendations should be present for missing skills");
    }
}
