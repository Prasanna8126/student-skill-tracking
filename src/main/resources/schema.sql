-- ==========================================================
-- Student Skill & Certification Tracking System Database Schema
-- Compatible with MySQL 8+ and standard relational SQL engines
-- ==========================================================

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS career_required_skills CASCADE;
DROP TABLE IF EXISTS student_skills CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS career_roles CASCADE;
DROP TABLE IF EXISTS skill_master CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles Table
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_id VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    academic_year VARCHAR(50),
    college VARCHAR(150),
    phone VARCHAR(25),
    bio TEXT,
    resume_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    profile_image_url VARCHAR(255),
    target_career_id BIGINT,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Master Skills Table
CREATE TABLE skill_master (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    description TEXT
);

-- Student Skills Table
CREATE TABLE student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_master_id BIGINT NOT NULL,
    skill_level VARCHAR(30) NOT NULL DEFAULT 'BEGINNER',
    proficiency INT NOT NULL DEFAULT 50,
    date_added DATE NOT NULL,
    evidence_url VARCHAR(255),
    CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill FOREIGN KEY (skill_master_id) REFERENCES skill_master(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_skill UNIQUE (student_id, skill_master_id)
);

-- Certifications Table
CREATE TABLE certifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    issuing_organization VARCHAR(150) NOT NULL,
    certificate_id VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_url VARCHAR(255),
    certificate_file_path VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    admin_feedback TEXT,
    verified_at TIMESTAMP,
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- Courses Table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    instructor VARCHAR(100),
    start_date DATE,
    completion_date DATE,
    progress_percentage INT NOT NULL DEFAULT 0,
    course_url VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    CONSTRAINT fk_course_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- Projects Table
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    technologies_used VARCHAR(255),
    category VARCHAR(80),
    start_date DATE,
    completion_date DATE,
    github_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
    CONSTRAINT fk_project_student FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- Career Roles Table
CREATE TABLE career_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    department_focus VARCHAR(100)
);

-- Career Required Skills Table
CREATE TABLE career_required_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    career_role_id BIGINT NOT NULL,
    skill_master_id BIGINT NOT NULL,
    minimum_level VARCHAR(30) NOT NULL DEFAULT 'INTERMEDIATE',
    weight INT NOT NULL DEFAULT 5,
    CONSTRAINT fk_crs_career FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_crs_skill FOREIGN KEY (skill_master_id) REFERENCES skill_master(id) ON DELETE CASCADE,
    CONSTRAINT uk_career_skill UNIQUE (career_role_id, skill_master_id)
);

-- Career Recommendations Table
CREATE TABLE recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    career_role_id BIGINT NOT NULL,
    skill_master_id BIGINT,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL, -- COURSE or CERTIFICATION
    provider VARCHAR(100) NOT NULL,
    url VARCHAR(255),
    estimated_duration VARCHAR(50),
    CONSTRAINT fk_rec_career FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_skill FOREIGN KEY (skill_master_id) REFERENCES skill_master(id) ON DELETE SET NULL
);

-- Notifications Table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
