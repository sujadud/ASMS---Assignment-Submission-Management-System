# Project Memory: ASMS - Assignment & Submission Management System

## 📌 Project Overview
Role-based academic assignment management platform built with .NET 8 Web API + Next.js App Router + PostgreSQL.

## 🛠 Tech Stack & Architecture Decisions
- **Backend Architecture**: Clean Architecture (Onion Pattern) with CQRS vertical slices.
- **Frontend Architecture**: Next.js App Router with Tailwind CSS & dynamic theme provider.
- **Database**: PostgreSQL with Entity Framework Core (EF Core) Code-First.
- **Dynamic Config**: `SettingService` with `IMemoryCache` for zero-downtime runtime policy updates.
- **Storage Strategy**: Pluggable `IStorageProvider` (Default: `LocalFileStorageProvider` saving to `wwwroot/uploads`).

## 🔑 Demo Credentials
- **Admin**: `admin@onnorokom.edu` | `Admin@123456`
- **Teacher**: `teacher@onnorokom.edu` | `Teacher@123456`
- **Student**: `student@onnorokom.edu` | `Student@123456`

## 📊 Implementation Progress Tracker
- [x] Initial specification analysis (`README.md` & recruitment prompt).
- [x] Phase & task breakdown created ([PHASES_AND_TASKS.md](file:///home/sudbug/source/repo/GitHub/ASMS---Assignment-Submission-Management-System/PHASES_AND_TASKS.md)).
- [x] Phase 1: Project Foundation & Database Setup.
- [x] Phase 2: Authentication & Core Provider Engines.
- [x] Phase 3: Backend API Features.
- [x] Phase 4: Frontend UI.
- [x] Phase 5: Testing, Verification & Final Delivery.

## 📝 Activity & Decision Log
- **2026-08-12**: Workspace initialized. `README.md` updated with complete spec. `PHASES_AND_TASKS.md` and `memory.md` created.
- **2026-08-12**: Phase 1 completed. Created Clean Architecture solution (`backend/`), Entities (`User`, `Classroom`, `Subject`, `Assignment`, `Submission`, `SystemSetting`), `ApplicationDbContext`, `DatabaseSeeder` with pre-seeded demo accounts (`Admin@123456`, `Teacher@123456`, `Student@123456`), and Next.js App Router setup (`frontend/` + Axios client).
- **2026-08-12**: Phases 2 – 5 completed.
  - Added JWT Bearer Authentication & Claims Generator (`IJwtTokenGenerator`, `CurrentUserService`).
  - Added Dynamic `SettingService` with `IMemoryCache` for zero-downtime theme & policy updates.
  - Implemented pluggable `IStorageProvider` strategy with `LocalFileStorageProvider` saving to `wwwroot/uploads`.
  - Implemented RESTful controllers (`AuthController`, `AdminController`, `TeacherController`, `StudentController`, `SettingsController`).
  - Implemented Next.js UI (`AuthContext`, `ThemeContext`, Login page with 1-click Quick Login demo switcher, Admin Users/Academics/Settings portals, Teacher Assignment & Submission Evaluation portal, Student Task Feed & Gradebook).
  - Wrote xUnit unit tests for Password Hashing, JWT Token Generation, and `SettingService` cache invalidation.
