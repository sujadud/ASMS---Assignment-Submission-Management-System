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
- [ ] Phase 1: Project Foundation & Database Setup.
- [ ] Phase 2: Authentication & Core Provider Engines.
- [ ] Phase 3: Backend API Features.
- [ ] Phase 4: Frontend UI.
- [ ] Phase 5: Testing, Verification & Final Delivery.

## 📝 Activity & Decision Log
- **2026-08-12**: Workspace initialized. `README.md` updated with complete spec. `PHASES_AND_TASKS.md` and `memory.md` created.
