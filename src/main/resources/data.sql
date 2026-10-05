-- ==========================================================
-- Student Skill & Certification Tracking System Seed Data
-- ==========================================================

-- Master Skills
INSERT INTO skill_master (id, name, category, description) VALUES
(1, 'Java', 'Programming Languages', 'Core Java, OOP principles, Concurrency, and JVM concepts'),
(2, 'Python', 'Programming Languages', 'Python scripting, data structures, and standard libraries'),
(3, 'C++', 'Programming Languages', 'Systems programming, STL, memory management, and algorithms'),
(4, 'C', 'Programming Languages', 'Procedural programming, pointers, and memory layout'),
(5, 'JavaScript', 'Frontend Development', 'Modern ES6+, DOM manipulation, and asynchronous programming'),
(6, 'HTML', 'Frontend Development', 'Semantic HTML5 markup and web accessibility standards'),
(7, 'CSS', 'Frontend Development', 'CSS3, Flexbox, Grid layouts, and responsive design'),
(8, 'React', 'Frontend Development', 'React functional components, hooks, and state management'),
(9, 'SQL', 'Database', 'Relational database queries, joins, indexes, and schema design'),
(10, 'Data Structures', 'Computer Science', 'Arrays, linked lists, trees, graphs, sorting, and search algorithms'),
(11, 'Spring Boot', 'Backend Development', 'Spring Boot microservices, dependency injection, and JPA'),
(12, 'REST API', 'Backend Development', 'HTTP methods, status codes, API design, and JSON serialization'),
(13, 'Git/GitHub', 'DevOps & Tools', 'Version control, branching, PR workflows, and git commands'),
(14, 'Machine Learning', 'Artificial Intelligence', 'Supervised/unsupervised learning, scikit-learn, and model evaluation'),
(15, 'Deep Learning', 'Artificial Intelligence', 'Neural networks, PyTorch, TensorFlow, and computer vision/NLP'),
(16, 'Cloud Computing', 'Cloud & Infrastructure', 'AWS, Azure, cloud architecture, and serverless fundamentals'),
(17, 'Docker', 'DevOps & Tools', 'Containerization, Dockerfiles, compose, and container registries'),
(18, 'Kubernetes', 'DevOps & Tools', 'Container orchestration, pods, deployments, and services'),
(19, 'Linux', 'Operating Systems', 'Command-line proficiency, shell scripting, and permissions'),
(20, 'Communication', 'Soft Skills', 'Technical writing, team presentations, and stakeholder communication'),
(21, 'Problem Solving', 'Soft Skills', 'Algorithmic thinking, debugging, and analytical problem breakdown'),
(22, 'Statistics', 'Data Science', 'Probability, hypothesis testing, distributions, and regression');

-- Career Roles
INSERT INTO career_roles (id, title, description, department_focus) VALUES
(1, 'Java Developer', 'Develops enterprise backend services, scalable REST APIs, and microservices using Java and Spring Boot.', 'Computer Science / IT'),
(2, 'Python Developer', 'Designs robust backend services, data pipelines, and automation utilities using Python frameworks.', 'Computer Science / IT'),
(3, 'Full Stack Developer', 'Builds end-to-end web applications covering responsive client interfaces and robust backend APIs.', 'Computer Science / IT / Software Eng'),
(4, 'Data Analyst', 'Transforms raw datasets into business intelligence through SQL modeling, statistics, and visualizations.', 'Data Science / IT / Mathematics'),
(5, 'AI/ML Engineer', 'Researches, trains, and deploys machine learning and deep learning models into production environments.', 'Artificial Intelligence / Computer Science'),
(6, 'Cloud Engineer', 'Architects, manages, and automates resilient cloud infrastructure, container clusters, and CI/CD pipelines.', 'Cloud Computing / DevOps / IT');

-- Career Required Skills
-- 1: Java Developer
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(1, 1, 'ADVANCED', 10),      -- Java
(1, 10, 'INTERMEDIATE', 8),  -- Data Structures
(1, 9, 'INTERMEDIATE', 8),   -- SQL
(1, 13, 'INTERMEDIATE', 7),  -- Git/GitHub
(1, 11, 'INTERMEDIATE', 9),  -- Spring Boot
(1, 12, 'ADVANCED', 9),      -- REST API
(1, 21, 'INTERMEDIATE', 6);  -- Problem Solving

-- 2: Python Developer
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(2, 2, 'ADVANCED', 10),      -- Python
(2, 10, 'INTERMEDIATE', 8),  -- Data Structures
(2, 9, 'INTERMEDIATE', 8),   -- SQL
(2, 13, 'INTERMEDIATE', 7),  -- Git/GitHub
(2, 12, 'INTERMEDIATE', 8),  -- REST API
(2, 19, 'BEGINNER', 6);      -- Linux

-- 3: Full Stack Developer
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(3, 5, 'ADVANCED', 9),       -- JavaScript
(3, 8, 'INTERMEDIATE', 9),   -- React
(3, 6, 'INTERMEDIATE', 7),   -- HTML
(3, 7, 'INTERMEDIATE', 7),   -- CSS
(3, 1, 'INTERMEDIATE', 8),   -- Java
(3, 11, 'INTERMEDIATE', 8),  -- Spring Boot
(3, 9, 'INTERMEDIATE', 8),   -- SQL
(3, 13, 'INTERMEDIATE', 7);  -- Git/GitHub

-- 4: Data Analyst
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(4, 9, 'ADVANCED', 10),      -- SQL
(4, 2, 'INTERMEDIATE', 8),   -- Python
(4, 22, 'INTERMEDIATE', 9),  -- Statistics
(4, 20, 'ADVANCED', 7),      -- Communication
(4, 21, 'INTERMEDIATE', 7);  -- Problem Solving

-- 5: AI/ML Engineer
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(5, 2, 'ADVANCED', 10),      -- Python
(5, 14, 'ADVANCED', 10),     -- Machine Learning
(5, 15, 'INTERMEDIATE', 9),  -- Deep Learning
(5, 10, 'INTERMEDIATE', 8),  -- Data Structures
(5, 22, 'ADVANCED', 9);      -- Statistics

-- 6: Cloud Engineer
INSERT INTO career_required_skills (career_role_id, skill_master_id, minimum_level, weight) VALUES
(6, 16, 'ADVANCED', 10),     -- Cloud Computing
(6, 17, 'INTERMEDIATE', 9),  -- Docker
(6, 18, 'INTERMEDIATE', 8),  -- Kubernetes
(6, 19, 'ADVANCED', 8),      -- Linux
(6, 13, 'INTERMEDIATE', 7);  -- Git/GitHub

-- Recommended Courses and Certifications
INSERT INTO recommendations (career_role_id, skill_master_id, title, type, provider, url, estimated_duration) VALUES
(1, 11, 'Spring Boot 3 & Spring Cloud Microservices', 'COURSE', 'Udemy', 'https://www.udemy.com/topic/spring-boot/', '35 hours'),
(1, 12, 'Designing RESTful Web APIs', 'COURSE', 'Coursera', 'https://www.coursera.org/learn/rest-api', '20 hours'),
(1, 1, 'Oracle Certified Professional: Java SE Developer', 'CERTIFICATION', 'Oracle', 'https://education.oracle.com/java-se-certification', '60 hours'),
(1, 13, 'GitHub Foundations Certification', 'CERTIFICATION', 'GitHub', 'https://resources.github.com/learn/certifications/', '15 hours'),
(2, 2, 'Complete Python Bootcamp From Zero to Hero', 'COURSE', 'Udemy', 'https://www.udemy.com/topic/python/', '22 hours'),
(2, 19, 'Linux System Administration Fundamentals', 'COURSE', 'Linux Foundation', 'https://training.linuxfoundation.org/', '30 hours'),
(3, 8, 'The Complete React 18 Developer Course', 'COURSE', 'Coursera', 'https://www.coursera.org/learn/react', '40 hours'),
(3, 5, 'Modern JavaScript from the Beginning', 'COURSE', 'Udemy', 'https://www.udemy.com/topic/javascript/', '25 hours'),
(4, 9, 'Advanced SQL for Data Scientists & Analysts', 'COURSE', 'DataCamp', 'https://www.datacamp.com/courses/sql', '18 hours'),
(4, 22, 'Applied Statistics for Business and Analytics', 'COURSE', 'Coursera', 'https://www.coursera.org/learn/statistics', '30 hours'),
(5, 14, 'Machine Learning Specialization by Andrew Ng', 'COURSE', 'DeepLearning.AI / Coursera', 'https://www.coursera.org/specializations/machine-learning-introduction', '60 hours'),
(5, 15, 'TensorFlow Developer Certificate', 'CERTIFICATION', 'Google', 'https://www.tensorflow.org/certificate', '50 hours'),
(6, 16, 'AWS Certified Solutions Architect - Associate', 'CERTIFICATION', 'Amazon Web Services', 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', '45 hours'),
(6, 17, 'Docker Certified Associate (DCA)', 'CERTIFICATION', 'Docker', 'https://www.docker.com/community/certification/', '25 hours'),
(6, 18, 'Certified Kubernetes Administrator (CKA)', 'CERTIFICATION', 'Cloud Native Computing Foundation', 'https://www.cncf.io/certification/cka/', '50 hours');
