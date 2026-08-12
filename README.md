Assignment & Submission Management System

A role-based web application built for school/college environments to manage academic assignments, student submissions, and evaluations. The platform features a Configurable System Architecture that allows administrators to dynamically adapt application behavior, UI themes, file upload policies, and academic rules through runtime settings and pluggable providers without altering source code.

📋 Table of Contents

• Project Overview

• Key Features

• Role-Based Access Control (RBAC)

• Configurable System Architecture

• Technology Stack

• System Architecture & Directory Structure

• Backend Architecture (Clean Architecture & Plugin Engine)

• Frontend Architecture (Next.js App Router)

• Demo Credentials

• Environment Configuration

• Database Setup & Automated Seeding

• Local Setup & Running Guide

• 1. Backend Setup

• 2. Frontend Setup

• Running Unit Tests

• Assumptions & Known Limitations

🌐 Project Overview

The Assignment & Submission Management System streamlines academic workflows between Administrators, Teachers, and Students. Teachers can draft, publish, and evaluate class assignments; Students can view tasks, upload answers before deadlines, and track grades; and Administrators manage users, courses, subjects, and application-level settings.

✨ Key Features

1. Role-Based Access Control (RBAC)

• 🔴 Admin Role:

• User Identity Management (Create, update, and manage Teachers and Students).

• Academic Mapping (Manage classes/courses, subjects, and assign teachers to subjects/classes).

• System Overview (View all assignments and student submissions across the institution).

• Application Settings Management (Manage application-level settings and policies).

• 🔵 Teacher Role:

• Assignment Management (Create, update, delete, draft, and publish assignments for specific classes/courses and subjects).

• Custom Parameters (Define title, description, deadline, and maximum marks).

• Submission Review Portal (View student submissions, assign marks, provide written feedback, and change submission status).

• 🟢 Student Role:

• Task Dashboard (View assignments assigned to their class/course, view details, and check deadlines).

• Submission Workflow (Submit answers and update submissions before the deadline if allowed).

• Gradebook & Feedback (View submission status, obtained marks, and teacher feedback).

2. Configurable System Architecture

• Dynamic UI & Theme Switcher: Administrators can customize font families (e.g., Inter, Plus Jakarta Sans, Roboto) and brand color palette presets (e.g., Slate & Indigo, Corporate Blue & Teal) dynamically via runtime settings.

• Global Assignment Policies: Configurable file extension whitelists (e.g., .pdf, .docx, .zip), maximum file upload size limits (e.g., 5 MB), late submission rules, and daily penalty percentages.

• Academic Rules & Metadata: Customizable grading scales (A+, A, B, C, F), current term/semester metadata, institution branding, and support contacts.

• Pluggable Provider Engine: Strategy interfaces for storage providers (Local Disk vs AWS S3) and grading policies, allowing runtime resolution without redeploying core application code.

🛠 Technology Stack

• Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Responsive UI, Form Validation, API Integration.

• Backend: ASP.NET Core Web API, C#, RESTful API Architecture, JWT Authentication, Role-based Authorization, Error Handling, Logging, Swagger/OpenAPI.

• Database: PostgreSQL with Entity Framework Core (EF Core) Code-First Migrations.

• Testing: xUnit, Moq, FluentAssertions covering business rules, authorization, and submission workflows.

📁 System Architecture & Directory Structure

Backend Architecture (Clean Architecture & Plugin Engine)

The backend follows Clean Architecture (Onion Architecture) combined with the Strategy / Provider Pattern to separate domain rules, application use cases, persistence, and configurable provider implementations:

backend/ ├── src/ │ ├── Core/ │ │ ├── Domain/ # Enterprise Entities, Enums, Value Objects, Domain Exceptions │ │ │ ├── Entities/ # User, Classroom, Subject, Assignment, Submission, SystemSetting │ │ │ ├── Enums/ # UserRole, SubmissionStatus, ThemePreset │ │ │ └── Interfaces/ # Domain Contracts & Repository Interfaces │ │ │ │ │ └── Application/ # Application Business Logic & Use Cases │ │ ├── Common/ # Interfaces (ICurrentUserService, IDateTime) │ │ ├── Configurations/ # Dynamic Settings DTOs & Options Classes │ │ ├── Features/ # Vertical Slices / Use Cases (CQRS Pattern) │ │ │ ├── Assignments/ # Commands, Queries, Handlers, Validators │ │ │ ├── Submissions/ # Commands, Queries, Handlers, Validators │ │ │ └── SystemSettings/ # Settings Commands, Queries, Handlers │ │ └── Providers/ # Strategy Contracts (IStorageProvider, IGradingStrategy) │ │ │ ├── Infrastructure/ │ │ ├── Infrastructure.Persistence/ # DbContext, EF Core Configurations, Migrations, Repositories │ │ ├── Infrastructure.Shared/ # SettingService (DB + IMemoryCache Engine), Dynamic Middlewares │ │ └── Infrastructure.Providers/ # Pluggable Implementations (Local/S3 Storage, Strategy Factories) │ │ │ └── Presentation/ │ └── API/ # Web API Entry Point, Controllers, Middlewares, Program.cs │ └── tests/ ├── Application.UnitTests/ # Business Logic & Submission Workflow Unit Tests └── Architecture.Tests/ # Architecture Rule Enforcement Tests 

Frontend Architecture (Next.js App Router)

frontend/ ├── src/ │ ├── app/ │ │ ├── (auth)/ # Authentication Routes (Login) │ │ ├── (dashboard)/ # Role-Guarded Dashboard Routes │ │ │ ├── (admin)/ # Admin Routes (/manage-users, /manage-academics, /settings) │ │ │ ├── (teacher)/ # Teacher Routes (/assignments, /submissions) │ │ │ ├── (student)/ # Student Routes (/my-assignments, /results) │ │ │ ├── layout.tsx # Dynamic Theme Injector & Dashboard Shell │ │ │ └── page.tsx # Overview & Route Switcher │ ├── components/ # Reusable UI Components (Tables, Modals, Forms, Status Badges) │ ├── lib/ # API Axios Client, Token Storage, Helpers │ └── types/ # TypeScript Interfaces & API Types 

🔑 Demo Credentials

Working login credentials pre-seeded into the PostgreSQL database for testing all three user roles:

RoleEmailPasswordScope & PrivilegesAdminadmin@onnorokom.eduAdmin@123456User & Academic setup, global assignments, system settingsTeacherteacher@onnorokom.eduTeacher@123456Create/publish assignments, review submissions, grade & feedbackStudentstudent@onnorokom.eduStudent@123456View assigned tasks, submit work, view marks & feedback 

⚙️ Environment Configuration

Backend Configuration (appsettings.json)

{ "ConnectionStrings": { "DefaultConnection": "Host=localhost;Port=5432;Database=AssignmentManagementDb;Username=postgres;Password=YOUR_POSTGRES_PASSWORD" }, "JwtSettings": { "SecretKey": "SuperSecretKeyForJWTTokenAuthenticationAssignmentSystem2026!", "Issuer": "OnnoRokomAPI", "Audience": "OnnoRokomClient", "ExpiryMinutes": 1440 } } 

Frontend Configuration (.env.example)

An .env.example file is included in the frontend repository root:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api 

🗄 Database Setup & Automated Seeding

The project uses EF Core Code-First Migrations with an automated initialization routine. Evaluators do not need to execute manual SQL scripts:

• When launching the backend API, Program.cs automatically executes pending EF Core migrations (Database.MigrateAsync()).

• Standard demo accounts (Admin, Teacher, Student), classrooms, subjects, sample assignments, and default system settings are automatically seeded if the database tables are empty.

🚀 Local Setup & Running Guide

Prerequisites

• .NET 8 SDK

• Node.js (v18+ or v20+)

• PostgreSQL Database Server (v14+)

1. Backend Setup

# Navigate to the API entry point directory cd backend/src/Presentation/API # Restore dependencies dotnet restore # Update appsettings.json with your local PostgreSQL password # Apply database migrations (Program.cs also runs this automatically on app start) dotnet ef database update # Run the backend ASP.NET Core API dotnet run 

• Swagger API Endpoint: http://localhost:5000/swagger

2. Frontend Setup

# Navigate to the frontend directory cd frontend # Install dependencies npm install # Run the Next.js development server npm run dev 

• Web Portal URL: http://localhost:3000

🧪 Running Unit Tests

Unit tests cover critical business rules, role-based authorization constraints, and submission workflows using xUnit and Moq:

# Navigate to the test project directory cd backend/tests/Application.UnitTests # Run unit tests dotnet test 

📌 Assumptions & Known Limitations

Assumptions

• Local Database Provisioning: Assumes PostgreSQL is installed and accessible locally on port 5432.

• File Storage Provider: By default, file uploads are handled by LocalFileStorageProvider saving files under wwwroot/uploads with strict file size and extension checks enforced dynamically by SettingService.

• Resubmission Rule: Re-uploading an assignment before the deadline replaces the previous file submission if allowed by the global assignment policy.

Known Limitations

• In-Memory Caching Invalidation: Settings are cached using IMemoryCache for zero-downtime updates on a single node; distributed multi-node deployments would require a Redis pub/sub backplane for instant cache synchronization.

• Real-Time Push: Grade notifications use REST polling rather than SignalR WebSockets.