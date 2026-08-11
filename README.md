# Unified Xebia Enterprise LMS Portal

Welcome to the **Unified Xebia Enterprise LMS Portal**, a single integrated platform designed to deliver corporate courses, manage events, and handle complete teacher-to-student assessments, grading, and certification.

This project merges the **Xebia LMS Courses Module**, the **Assessment Portal Module**, and the **Event Management Module** into one complete production-ready application with shared authentication, unified layout navigation, a shared Spring Boot backend, and a MongoDB integration.

---

## 📂 Integrated Folder Structure

The repository represents one complete integrated application structured as follows:

```
LMS/                          <- True Integrated Project Root
├── .github/                  <- GitHub Actions CI/CD workflows
├── Assessment-Portal/        <- Standalone Reference Module (Deprecated/Static)
├── Xebia-LMS/                <- Main Active Application Folder
│   ├── backend/              <- Shared Spring Boot Java Backend
│   │   ├── pom.xml           <- Backend Dependency Management
│   │   └── src/              <- Java controllers, models, DTOs, and configs
│   ├── public/               <- Static assets & icons
│   ├── src/                  <- Next.js 16.2 Client Frontend (React/TypeScript)
│   │   ├── app/              <- Next.js App Router Pages (Events, Assessments, Courses...)
│   │   ├── components/       <- Reusable UI components & layouts
│   │   ├── lib/              <- API Client & React context state
│   │   └── types/            <- Shared TypeScript interfaces
│   ├── package.json          <- Next.js Dependency Management
│   └── next.config.mjs       <- Routing, Proxy configurations & Path Aliases
├── .gitignore                <- Repository exclusions (secrets, targets, node_modules)
└── README.md                 <- This Documentation
```

---

## 🔑 Shared Demo Credentials

The platform uses NextAuth JWT for secure, single-sign-on (SSO) session management:

| Role | Email / Username | Password |
| :--- | :--- | :--- |
| **Enterprise Admin** | `admin@xebia.com` | `admin123` |
| **Learner** | `learner@xebia.com` | `learner123` |
| **Teacher (Instructor)** | *Create via Admin panel or register* | *Configurable* |

---

## 🚀 Technical Architecture

### 1. Unified Frontend (Next.js 16.2 + TypeScript + TailwindCSS)
- **Path Aliases**: Uses clean path aliases `@/*` pointing to `./src/*` mapped in `jsconfig.json`/`tsconfig.json`.
- **Shared Navigation**: A unified dynamic [Sidebar](Xebia-LMS/src/components/common/Sidebar.js) rendering specific options for **Admin**, **Teacher**, and **Learner** spaces.
- **Client State**: Synced via NextAuth sessions and local context providers.

### 2. Unified Backend (Spring Boot 3 + Maven)
- **REST Services**: Exposes routes for `/api/auth`, `/api/assessments`, `/api/submissions`, `/api/events`, and `/api/materials`.
- **Database Integration**: Standardizes data mapping against **MongoDB** for document schemas (Assessments, Submissions, Events, Registrations) and **JPA H2** for in-memory relational components.

---

## 🛠️ Setup & Running Locally

### Prerequisites
- **Java JDK 17+**
- **Node.js v18+**
- **MongoDB** running locally or a MongoDB Atlas URI

### Step 1: Running the Backend
1. Navigate to the backend folder:
   ```bash
   cd Xebia-LMS/backend
   ```
2. Configure your MongoDB connection string in `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/employeeDB
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

### Step 2: Running the Frontend
1. Navigate to the main app folder:
   ```bash
   cd Xebia-LMS
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the unified platform at `http://localhost:3000`.

---

## 📦 Production Build Checks

To verify that the application compiles without errors:

**Build Frontend:**
```bash
cd Xebia-LMS
npm run build
```

**Package Backend:**
```bash
cd Xebia-LMS/backend
.\mvnw.cmd clean package -DskipTests
```
