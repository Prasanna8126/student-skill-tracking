package com.rtps.platform.util;

import com.rtps.platform.entity.*;
import com.rtps.platform.entity.enums.*;
import com.rtps.platform.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillMasterRepository skillMasterRepository;
    private final CareerRoleRepository careerRoleRepository;
    private final CareerRequiredSkillRepository careerRequiredSkillRepository;
    private final RecommendationRepository recommendationRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final CertificationRepository certificationRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      StudentProfileRepository studentProfileRepository,
                      SkillMasterRepository skillMasterRepository,
                      CareerRoleRepository careerRoleRepository,
                      CareerRequiredSkillRepository careerRequiredSkillRepository,
                      RecommendationRepository recommendationRepository,
                      StudentSkillRepository studentSkillRepository,
                      CertificationRepository certificationRepository,
                      CourseRepository courseRepository,
                      ProjectRepository projectRepository,
                      NotificationRepository notificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.skillMasterRepository = skillMasterRepository;
        this.careerRoleRepository = careerRoleRepository;
        this.careerRequiredSkillRepository = careerRequiredSkillRepository;
        this.recommendationRepository = recommendationRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.certificationRepository = certificationRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Only seed if Users are empty
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println(">>> Seeding database with initial sample data...");

        // 1. Seed Master Skills
        Map<String, SkillMaster> skills = seedSkills();

        // 2. Seed Career Roles, Required Skills & Recommendations
        Map<String, CareerRole> roles = seedCareerRoles(skills);

        // 3. Seed Admin Account
        User admin = new User("admin@system.com", passwordEncoder.encode("Admin@123"), "System Administrator", Role.ROLE_ADMIN);
        userRepository.save(admin);

        // 4. Seed Student 1: John Doe
        seedJohnDoe(skills, roles.get("Java Developer"));

        // 5. Seed Student 2: Sarah Smith
        seedSarahSmith(skills, roles.get("AI/ML Engineer"));

        System.out.println(">>> Database seeding completed successfully!");
    }

    private Map<String, SkillMaster> seedSkills() {
        Map<String, SkillMaster> map = new HashMap<>();
        String[][] data = {
                {"Java", "Programming Languages", "Core Java, OOP principles, Concurrency, and JVM concepts"},
                {"Python", "Programming Languages", "Python scripting, data structures, and standard libraries"},
                {"C++", "Programming Languages", "Systems programming, STL, memory management, and algorithms"},
                {"C", "Programming Languages", "Procedural programming, pointers, and memory layout"},
                {"JavaScript", "Frontend Development", "Modern ES6+, DOM manipulation, and asynchronous programming"},
                {"HTML", "Frontend Development", "Semantic HTML5 markup and web accessibility standards"},
                {"CSS", "Frontend Development", "CSS3, Flexbox, Grid layouts, and responsive design"},
                {"React", "Frontend Development", "React functional components, hooks, and state management"},
                {"SQL", "Database", "Relational database queries, joins, indexes, and schema design"},
                {"Data Structures", "Computer Science", "Arrays, linked lists, trees, graphs, sorting, and search algorithms"},
                {"Spring Boot", "Backend Development", "Spring Boot microservices, dependency injection, and JPA"},
                {"REST API", "Backend Development", "HTTP methods, status codes, API design, and JSON serialization"},
                {"Git/GitHub", "DevOps & Tools", "Version control, branching, PR workflows, and git commands"},
                {"Machine Learning", "Artificial Intelligence", "Supervised/unsupervised learning, scikit-learn, and model evaluation"},
                {"Deep Learning", "Artificial Intelligence", "Neural networks, PyTorch, TensorFlow, and computer vision/NLP"},
                {"Cloud Computing", "Cloud & Infrastructure", "AWS, Azure, cloud architecture, and serverless fundamentals"},
                {"Docker", "DevOps & Tools", "Containerization, Dockerfiles, compose, and container registries"},
                {"Kubernetes", "DevOps & Tools", "Container orchestration, pods, deployments, and services"},
                {"Linux", "Operating Systems", "Command-line proficiency, shell scripting, and permissions"},
                {"Communication", "Soft Skills", "Technical writing, team presentations, and stakeholder communication"},
                {"Problem Solving", "Soft Skills", "Algorithmic thinking, debugging, and analytical problem breakdown"},
                {"Statistics", "Data Science", "Probability, hypothesis testing, distributions, and regression"}
        };

        for (String[] row : data) {
            SkillMaster s = new SkillMaster(row[0], row[1], row[2]);
            map.put(row[0], skillMasterRepository.save(s));
        }
        return map;
    }

    private Map<String, CareerRole> seedCareerRoles(Map<String, SkillMaster> s) {
        Map<String, CareerRole> roles = new HashMap<>();

        // 1. Java Developer
        CareerRole r1 = new CareerRole("Java Developer",
                "Develops enterprise backend services, scalable REST APIs, and microservices using Java and Spring Boot.",
                "Computer Science / IT");
        careerRoleRepository.save(r1);
        roles.put("Java Developer", r1);

        addReq(r1, s.get("Java"), SkillLevel.ADVANCED, 10);
        addReq(r1, s.get("Data Structures"), SkillLevel.INTERMEDIATE, 8);
        addReq(r1, s.get("SQL"), SkillLevel.INTERMEDIATE, 8);
        addReq(r1, s.get("Git/GitHub"), SkillLevel.INTERMEDIATE, 7);
        addReq(r1, s.get("Spring Boot"), SkillLevel.INTERMEDIATE, 9);
        addReq(r1, s.get("REST API"), SkillLevel.ADVANCED, 9);
        addReq(r1, s.get("Problem Solving"), SkillLevel.INTERMEDIATE, 6);

        addRec(r1, s.get("Spring Boot"), "Spring Boot 3 & Spring Cloud Microservices", RecommendationType.COURSE, "Udemy", "https://www.udemy.com/topic/spring-boot/", "35 hours");
        addRec(r1, s.get("REST API"), "Designing RESTful Web APIs", RecommendationType.COURSE, "Coursera", "https://www.coursera.org/learn/rest-api", "20 hours");
        addRec(r1, s.get("Java"), "Oracle Certified Professional: Java SE Developer", RecommendationType.CERTIFICATION, "Oracle", "https://education.oracle.com/java-se-certification", "60 hours");
        addRec(r1, s.get("Git/GitHub"), "GitHub Foundations Certification", RecommendationType.CERTIFICATION, "GitHub", "https://resources.github.com/learn/certifications/", "15 hours");

        // 2. Python Developer
        CareerRole r2 = new CareerRole("Python Developer",
                "Designs robust backend services, data pipelines, and automation utilities using Python frameworks.",
                "Computer Science / IT");
        careerRoleRepository.save(r2);
        roles.put("Python Developer", r2);

        addReq(r2, s.get("Python"), SkillLevel.ADVANCED, 10);
        addReq(r2, s.get("Data Structures"), SkillLevel.INTERMEDIATE, 8);
        addReq(r2, s.get("SQL"), SkillLevel.INTERMEDIATE, 8);
        addReq(r2, s.get("Git/GitHub"), SkillLevel.INTERMEDIATE, 7);
        addReq(r2, s.get("REST API"), SkillLevel.INTERMEDIATE, 8);
        addReq(r2, s.get("Linux"), SkillLevel.BEGINNER, 6);

        addRec(r2, s.get("Python"), "Complete Python Bootcamp From Zero to Hero", RecommendationType.COURSE, "Udemy", "https://www.udemy.com/topic/python/", "22 hours");
        addRec(r2, s.get("Linux"), "Linux System Administration Fundamentals", RecommendationType.COURSE, "Linux Foundation", "https://training.linuxfoundation.org/", "30 hours");

        // 3. Full Stack Developer
        CareerRole r3 = new CareerRole("Full Stack Developer",
                "Builds end-to-end web applications covering responsive client interfaces and robust backend APIs.",
                "Computer Science / IT / Software Eng");
        careerRoleRepository.save(r3);
        roles.put("Full Stack Developer", r3);

        addReq(r3, s.get("JavaScript"), SkillLevel.ADVANCED, 9);
        addReq(r3, s.get("React"), SkillLevel.INTERMEDIATE, 9);
        addReq(r3, s.get("HTML"), SkillLevel.INTERMEDIATE, 7);
        addReq(r3, s.get("CSS"), SkillLevel.INTERMEDIATE, 7);
        addReq(r3, s.get("Java"), SkillLevel.INTERMEDIATE, 8);
        addReq(r3, s.get("Spring Boot"), SkillLevel.INTERMEDIATE, 8);
        addReq(r3, s.get("SQL"), SkillLevel.INTERMEDIATE, 8);
        addReq(r3, s.get("Git/GitHub"), SkillLevel.INTERMEDIATE, 7);

        addRec(r3, s.get("React"), "The Complete React 18 Developer Course", RecommendationType.COURSE, "Coursera", "https://www.coursera.org/learn/react", "40 hours");
        addRec(r3, s.get("JavaScript"), "Modern JavaScript from the Beginning", RecommendationType.COURSE, "Udemy", "https://www.udemy.com/topic/javascript/", "25 hours");

        // 4. Data Analyst
        CareerRole r4 = new CareerRole("Data Analyst",
                "Transforms raw datasets into business intelligence through SQL modeling, statistics, and visualizations.",
                "Data Science / IT / Mathematics");
        careerRoleRepository.save(r4);
        roles.put("Data Analyst", r4);

        addReq(r4, s.get("SQL"), SkillLevel.ADVANCED, 10);
        addReq(r4, s.get("Python"), SkillLevel.INTERMEDIATE, 8);
        addReq(r4, s.get("Statistics"), SkillLevel.INTERMEDIATE, 9);
        addReq(r4, s.get("Communication"), SkillLevel.ADVANCED, 7);
        addReq(r4, s.get("Problem Solving"), SkillLevel.INTERMEDIATE, 7);

        addRec(r4, s.get("SQL"), "Advanced SQL for Data Scientists & Analysts", RecommendationType.COURSE, "DataCamp", "https://www.datacamp.com/courses/sql", "18 hours");
        addRec(r4, s.get("Statistics"), "Applied Statistics for Business and Analytics", RecommendationType.COURSE, "Coursera", "https://www.coursera.org/learn/statistics", "30 hours");

        // 5. AI/ML Engineer
        CareerRole r5 = new CareerRole("AI/ML Engineer",
                "Researches, trains, and deploys machine learning and deep learning models into production environments.",
                "Artificial Intelligence / Computer Science");
        careerRoleRepository.save(r5);
        roles.put("AI/ML Engineer", r5);

        addReq(r5, s.get("Python"), SkillLevel.ADVANCED, 10);
        addReq(r5, s.get("Machine Learning"), SkillLevel.ADVANCED, 10);
        addReq(r5, s.get("Deep Learning"), SkillLevel.INTERMEDIATE, 9);
        addReq(r5, s.get("Data Structures"), SkillLevel.INTERMEDIATE, 8);
        addReq(r5, s.get("Statistics"), SkillLevel.ADVANCED, 9);

        addRec(r5, s.get("Machine Learning"), "Machine Learning Specialization by Andrew Ng", RecommendationType.COURSE, "DeepLearning.AI / Coursera", "https://www.coursera.org/specializations/machine-learning-introduction", "60 hours");
        addRec(r5, s.get("Deep Learning"), "TensorFlow Developer Certificate", RecommendationType.CERTIFICATION, "Google", "https://www.tensorflow.org/certificate", "50 hours");

        // 6. Cloud Engineer
        CareerRole r6 = new CareerRole("Cloud Engineer",
                "Architects, manages, and automates resilient cloud infrastructure, container clusters, and CI/CD pipelines.",
                "Cloud Computing / DevOps / IT");
        careerRoleRepository.save(r6);
        roles.put("Cloud Engineer", r6);

        addReq(r6, s.get("Cloud Computing"), SkillLevel.ADVANCED, 10);
        addReq(r6, s.get("Docker"), SkillLevel.INTERMEDIATE, 9);
        addReq(r6, s.get("Kubernetes"), SkillLevel.INTERMEDIATE, 8);
        addReq(r6, s.get("Linux"), SkillLevel.ADVANCED, 8);
        addReq(r6, s.get("Git/GitHub"), SkillLevel.INTERMEDIATE, 7);

        addRec(r6, s.get("Cloud Computing"), "AWS Certified Solutions Architect - Associate", RecommendationType.CERTIFICATION, "Amazon Web Services", "https://aws.amazon.com/certification/certified-solutions-architect-associate/", "45 hours");
        addRec(r6, s.get("Docker"), "Docker Certified Associate (DCA)", RecommendationType.CERTIFICATION, "Docker", "https://www.docker.com/community/certification/", "25 hours");
        addRec(r6, s.get("Kubernetes"), "Certified Kubernetes Administrator (CKA)", RecommendationType.CERTIFICATION, "Cloud Native Computing Foundation", "https://www.cncf.io/certification/cka/", "50 hours");

        return roles;
    }

    private void addReq(CareerRole role, SkillMaster skill, SkillLevel level, int weight) {
        CareerRequiredSkill crs = new CareerRequiredSkill(role, skill, level, weight);
        careerRequiredSkillRepository.save(crs);
    }

    private void addRec(CareerRole role, SkillMaster skill, String title, RecommendationType type, String provider, String url, String dur) {
        Recommendation rec = new Recommendation(role, skill, title, type, provider, url, dur);
        recommendationRepository.save(rec);
    }

    private void seedJohnDoe(Map<String, SkillMaster> s, CareerRole targetRole) {
        User user = new User("john.doe@university.edu", passwordEncoder.encode("Student@123"), "John Doe", Role.ROLE_STUDENT);
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile(user);
        profile.setStudentId("STU-2024-001");
        profile.setDepartment("Computer Science & Engineering");
        profile.setAcademicYear("3rd Year");
        profile.setCollege("Apex Institute of Technology");
        profile.setPhone("+1 (555) 234-5678");
        profile.setBio("Passionate 3rd-year CS undergrad focusing on enterprise backend systems, scalable cloud microservices, and distributed architecture.");
        profile.setResumeUrl("https://example.com/resumes/john-doe.pdf");
        profile.setLinkedinUrl("https://linkedin.com/in/johndoe-tech");
        profile.setGithubUrl("https://github.com/johndoe-dev");
        profile.setProfileImageUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80");
        profile.setTargetCareer(targetRole);
        profile = studentProfileRepository.save(profile);

        // Skills
        studentSkillRepository.save(new StudentSkill(profile, s.get("Java"), SkillLevel.ADVANCED, 85, "https://github.com/johndoe-dev/java-core-repo"));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Data Structures"), SkillLevel.INTERMEDIATE, 65, "https://leetcode.com/johndoe"));
        studentSkillRepository.save(new StudentSkill(profile, s.get("SQL"), SkillLevel.ADVANCED, 80, "https://github.com/johndoe-dev/database-projects"));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Git/GitHub"), SkillLevel.INTERMEDIATE, 75, "https://github.com/johndoe-dev"));
        studentSkillRepository.save(new StudentSkill(profile, s.get("HTML"), SkillLevel.ADVANCED, 90, null));
        studentSkillRepository.save(new StudentSkill(profile, s.get("CSS"), SkillLevel.INTERMEDIATE, 70, null));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Problem Solving"), SkillLevel.INTERMEDIATE, 65, null));

        // Certifications
        Certification c1 = new Certification(profile, "Oracle Certified Associate, Java SE 8 Programmer",
                "Oracle", "OCA-928374", LocalDate.of(2023, 8, 15), null,
                "https://catalog-education.oracle.com/pls/certview/shareBadge?id=1234", null);
        c1.setStatus(CertificationStatus.VERIFIED);
        c1.setVerifiedAt(LocalDateTime.now().minusMonths(6));
        certificationRepository.save(c1);

        Certification c2 = new Certification(profile, "AWS Certified Cloud Practitioner",
                "Amazon Web Services", "AWS-CP-88491", LocalDate.of(2024, 2, 10), LocalDate.of(2027, 2, 10),
                "https://aws.amazon.com/verification", null);
        c2.setStatus(CertificationStatus.PENDING);
        certificationRepository.save(c2);

        // Courses
        courseRepository.save(new Course(profile, "Java Concurrency & Multithreading in Practice", "Udemy",
                "Tim Buchalka", LocalDate.of(2023, 10, 1), LocalDate.of(2023, 11, 20),
                100, "https://udemy.com/course/java-multithreading", CourseStatus.COMPLETED));

        courseRepository.save(new Course(profile, "Spring Boot 3, Spring 6 & Hibernate for Beginners", "Coursera",
                "Chad Darby", LocalDate.of(2024, 1, 15), null,
                65, "https://coursera.org/learn/spring-boot-essentials", CourseStatus.IN_PROGRESS));

        // Projects
        projectRepository.save(new Project(profile, "E-Commerce REST API Microservices",
                "Engineered a resilient e-commerce backend with Spring Boot, PostgreSQL, and Docker containerization.",
                "Java, Spring Boot, PostgreSQL, Docker, Maven", "Backend Development",
                LocalDate.of(2023, 9, 1), LocalDate.of(2023, 12, 15),
                "https://github.com/johndoe-dev/ecommerce-microservices", "https://api.johndoe.dev/demo", ProjectStatus.COMPLETED));

        projectRepository.save(new Project(profile, "Smart Student Skill Tracker System",
                "Full-stack student tracking and skill gap analysis dashboard with modern responsive UI and analytics.",
                "Java, Spring Boot, REST API, Tailwind CSS, Chart.js", "Full Stack Web App",
                LocalDate.of(2024, 2, 1), null,
                "https://github.com/johndoe-dev/student-skill-tracker", null, ProjectStatus.IN_PROGRESS));

        // Notifications
        notificationRepository.save(new Notification(user, "Certification Verified",
                "Your Oracle Certified Associate certification has been verified by the administrator.",
                NotificationType.SUCCESS));
        notificationRepository.save(new Notification(user, "Skill Gap Update",
                "To achieve 100% readiness for Java Developer, complete the recommended Spring Boot and REST API courses.",
                NotificationType.INFO));
    }

    private void seedSarahSmith(Map<String, SkillMaster> s, CareerRole targetRole) {
        User user = new User("sarah.smith@university.edu", passwordEncoder.encode("Student@123"), "Sarah Smith", Role.ROLE_STUDENT);
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile(user);
        profile.setStudentId("STU-2024-002");
        profile.setDepartment("Artificial Intelligence & Data Science");
        profile.setAcademicYear("4th Year");
        profile.setCollege("Apex Institute of Technology");
        profile.setPhone("+1 (555) 345-6789");
        profile.setBio("Senior student dedicated to computer vision, NLP, and deep learning algorithms with a proven record in competitive machine learning.");
        profile.setLinkedinUrl("https://linkedin.com/in/sarah-smith-ai");
        profile.setGithubUrl("https://github.com/sarahsmith-ai");
        profile.setProfileImageUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80");
        profile.setTargetCareer(targetRole);
        profile = studentProfileRepository.save(profile);

        studentSkillRepository.save(new StudentSkill(profile, s.get("Python"), SkillLevel.EXPERT, 95, "https://github.com/sarahsmith-ai"));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Machine Learning"), SkillLevel.ADVANCED, 85, null));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Statistics"), SkillLevel.ADVANCED, 80, null));
        studentSkillRepository.save(new StudentSkill(profile, s.get("Data Structures"), SkillLevel.INTERMEDIATE, 70, null));

        Certification c1 = new Certification(profile, "Deep Learning Specialization",
                "DeepLearning.AI", "DL-SPEC-9021", LocalDate.of(2023, 11, 10), null,
                "https://coursera.org/verify/specialization/123", null);
        c1.setStatus(CertificationStatus.VERIFIED);
        c1.setVerifiedAt(LocalDateTime.now().minusMonths(3));
        certificationRepository.save(c1);

        courseRepository.save(new Course(profile, "Neural Networks and Deep Learning", "Coursera",
                "Andrew Ng", LocalDate.of(2023, 7, 1), LocalDate.of(2023, 8, 15),
                100, "https://coursera.org/learn/neural-networks-deep-learning", CourseStatus.COMPLETED));

        projectRepository.save(new Project(profile, "Medical Image Segmentation with PyTorch",
                "Implemented a U-Net architecture for biomedical image segmentation with 94.2% dice coefficient.",
                "Python, PyTorch, OpenCV, NumPy", "Machine Learning",
                LocalDate.of(2023, 10, 1), LocalDate.of(2023, 12, 20),
                "https://github.com/sarahsmith-ai/unet-segmentation", null, ProjectStatus.COMPLETED));

        notificationRepository.save(new Notification(user, "Certification Verified",
                "Your Deep Learning Specialization certificate has been approved by the admin.",
                NotificationType.SUCCESS));
    }
}
