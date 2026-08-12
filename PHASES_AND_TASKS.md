# ASMS - Implementation Phases & Task Breakdown

## 🚀 Phase 1: Project Foundation & Database Setup
- [ ] **Task 1.1: Backend Clean Architecture Solution**
  - Create .NET 8 solution with projects: `Core.Domain`, `Core.Application`, `Infrastructure.Persistence`, `Infrastructure.Shared`, `Infrastructure.Providers`, `Presentation.API`.
- [ ] **Task 1.2: Domain Entities & Enums**
  - Define `User`, `Classroom`, `Subject`, `Assignment`, `Submission`, `SystemSetting`.
  - Enums: `UserRole`, `SubmissionStatus`, `ThemePreset`.
- [ ] **Task 1.3: EF Core DbContext & Migrations**
  - Configure PostgreSQL EF Core mappings, relationships, initial migration.
- [ ] **Task 1.4: Automated Seeding Engine**
  - Seed default demo accounts (`Admin@123456`, `Teacher@123456`, `Student@123456`), sample classes, subjects, settings.
- [ ] **Task 1.5: Frontend Next.js Project Setup**
  - Scaffold Next.js App Router project in `frontend/`, configure TypeScript, Tailwind CSS, Axios client.

---

## 🔐 Phase 2: Authentication & Core Provider Engines
- [ ] **Task 2.1: JWT Authentication & Role Authorization**
  - Implement `POST /api/auth/login`, JWT generator, `[Authorize(Roles = "...")]` middleware.
- [ ] **Task 2.2: Dynamic SettingService Engine**
  - Build runtime configuration engine with `IMemoryCache` for zero-downtime theme & policy updates.
- [ ] **Task 2.3: Pluggable File Storage Provider Engine**
  - Implement `IStorageProvider` strategy interface with `LocalFileStorageProvider` (`wwwroot/uploads`) and `S3FileStorageProvider` skeleton.

---

## ⚡ Phase 3: Backend API Features (CQRS / Vertical Slices)
- [ ] **Task 3.1: Admin Module APIs**
  - User CRUD endpoints (`/api/admin/users`).
  - Academics management (`/api/admin/classrooms`, `/api/admin/subjects`).
  - System settings endpoints (`/api/admin/settings`).
- [ ] **Task 3.2: Teacher Module APIs**
  - Assignment CRUD & Draft/Publish toggle (`/api/teacher/assignments`).
  - Submission review, status update, grading & feedback (`/api/teacher/submissions`).
- [ ] **Task 3.3: Student Module APIs**
  - Class assignment list & task details (`/api/student/assignments`).
  - Answer file submission & resubmission before deadline (`/api/student/submissions`).
  - Student gradebook & feedback portal (`/api/student/results`).

---

## 🎨 Phase 4: Frontend UI (Next.js App Router)
- [ ] **Task 4.1: Authentication & Protected Layouts**
  - Implement Login page, JWT session storage, role-guarded route middleware.
- [ ] **Task 4.2: Dynamic Theme Injector Component**
  - Read system settings API on layout render to dynamically inject theme fonts & color presets.
- [ ] **Task 4.3: Admin Dashboard UI**
  - Build User Management, Academic Mapping, System Configuration screens.
- [ ] **Task 4.4: Teacher Dashboard UI**
  - Build Assignment Creation Modal, Assignment Table, Submission Grading Interface.
- [ ] **Task 4.5: Student Dashboard UI**
  - Build Task Feed, Deadline Counter, File Upload Modal, Result/Feedback view.

---

## 🧪 Phase 5: Testing, Verification & Final Delivery
- [ ] **Task 5.1: Backend Unit Tests**
  - Write xUnit + Moq tests for RBAC enforcement, late penalty calculations, resubmission policy rules.
- [ ] **Task 5.2: Integration & Workflow Verification**
  - Test end-to-end flow from Admin setup -> Teacher creation -> Student submission -> Teacher evaluation.
- [ ] **Task 5.3: Environment & Setup Verification**
  - Verify `.env.example`, `appsettings.json`, Swagger documentation, local startup readiness.
