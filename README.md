# Student Skill & Certification Tracking System

A full-stack web application for students to manage and track their technical skills, certifications, courses, and projects — with intelligent **Skill Gap Analysis** to guide career readiness.

---

## 🚀 Features

### Student
- 📊 **Dashboard** — KPI cards, skill distribution charts, learning progress
- 👤 **Profile** — Academic info, resume/LinkedIn/GitHub links
- 🛠️ **Skill Management** — Add/edit skills with proficiency levels (Beginner → Expert)
- 📜 **Certifications** — Upload/link certificates, track verification status
- 📚 **Course Tracking** — Progress bars, completion tracking
- 💼 **Project Portfolio** — GitHub/demo links, tech stack tagging
- 🎯 **Skill Gap Analysis** — Compare your skills vs. target career roles, get recommendations
- 📈 **Career Progress** — 4-pillar readiness score (Skills, Certs, Projects, Courses)
- 📄 **Career Dossier Report** — One-click PDF download

### Admin
- 👥 View all registered students
- ✅ Verify/reject student certifications with feedback
- 🏢 Manage career roles and required skills
- 📊 Admin dashboard with stats and charts

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3.4 |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| Database | H2 (embedded, file-based) / MySQL (optional) |
| ORM | Spring Data JPA + Hibernate |
| Frontend | Vanilla JS SPA (ES Modules), Tailwind CSS, Chart.js |
| PDF Export | html2pdf.js |
| Build Tool | Apache Maven 3.9.9 |

---

## ⚙️ Getting Started

### Prerequisites
- Java 21+
- Maven 3.9+ (or use the included `mvnw` wrapper)

### Run the Application

```bash
git clone https://github.com/Prasanna8126/student-skill-tracking.git
cd student-skill-tracking

# Build and run
mvnw.cmd package -DskipTests=true
java -jar target/skill-tracker-1.0.0.jar
```

Then open: **http://localhost:8080**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | `john.doe@university.edu` | `Student@123` |
| 👩‍🎓 Student 2 | `sarah.smith@university.edu` | `Student@123` |
| 🛡️ Admin | `admin@system.com` | `Admin@123` |

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (Student & Admin) |
| GET | `/api/students/profile` | Get student profile |
| PUT | `/api/students/profile` | Update profile |
| GET/POST | `/api/student/skills` | Manage skills |
| GET/POST | `/api/certifications` | Manage certifications |
| GET/POST | `/api/courses` | Manage courses |
| GET/POST | `/api/projects` | Manage projects |
| GET | `/api/careers` | List career roles |
| GET | `/api/career-analysis/{id}` | Skill gap analysis |
| GET | `/api/career-progress` | Career readiness score |
| GET | `/api/reports/student` | Career dossier report |
| GET | `/api/admin/dashboard` | Admin metrics |
| PUT | `/api/admin/certifications/{id}/verify` | Verify certification |

---

## 🧪 Running Tests

```bash
mvnw.cmd test
```

All 9 tests pass:
- `RtpsApplicationTests` — Spring context loads
- `SkillGapServiceTest` — Skill gap engine logic
- `FullWorkflowIntegrationTest` (7 tests) — End-to-end API workflow

---

## 📁 Project Structure

```
src/
├── main/
│   ├── java/com/rtps/platform/
│   │   ├── controller/     # REST API controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Spring Data JPA repos
│   │   ├── entity/         # JPA entities
│   │   ├── dto/            # Request/Response DTOs
│   │   ├── security/       # JWT + Spring Security
│   │   └── util/           # DataLoader (seed data)
│   └── resources/
│       ├── static/         # Frontend SPA (HTML/CSS/JS)
│       └── application.properties
└── test/                   # JUnit integration tests
```

---

## 📄 License

MIT License — free to use for academic and personal projects.
