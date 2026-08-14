-- ASMS (Assignment & Submission Management System) Database Initialization Script
-- PostgreSQL DDL Schema and Initial Seed Data

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "Classrooms" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "AcademicYear" VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Users" (
    "Id" UUID PRIMARY KEY,
    "FullName" VARCHAR(150) NOT NULL,
    "Email" VARCHAR(150) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(500) NOT NULL,
    "Role" INTEGER NOT NULL, -- 0: Admin, 1: Teacher, 2: Student
    "ClassroomId" UUID NULL REFERENCES "Classrooms"("Id") ON DELETE SET NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Subjects" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Code" VARCHAR(20) NOT NULL,
    "TeacherId" UUID NULL REFERENCES "Users"("Id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "Assignments" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Description" TEXT NOT NULL,
    "Deadline" TIMESTAMP WITH TIME ZONE NOT NULL,
    "MaxMarks" NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    "IsPublished" BOOLEAN NOT NULL DEFAULT FALSE,
    "TeacherId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ClassroomId" UUID NOT NULL REFERENCES "Classrooms"("Id") ON DELETE CASCADE,
    "SubjectId" UUID NOT NULL REFERENCES "Subjects"("Id") ON DELETE CASCADE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Submissions" (
    "Id" UUID PRIMARY KEY,
    "AssignmentId" UUID NOT NULL REFERENCES "Assignments"("Id") ON DELETE CASCADE,
    "StudentId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "FilePath" VARCHAR(500) NOT NULL,
    "OriginalFileName" VARCHAR(255) NOT NULL,
    "FileSizeBytes" BIGINT NOT NULL,
    "SubmittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" INTEGER NOT NULL DEFAULT 0, -- 0: Submitted, 1: Evaluated, 2: Late, 3: Rejected
    "MarksObtained" NUMERIC(5,2) NULL,
    "Feedback" TEXT NOT NULL DEFAULT '',
    "EvaluatedAt" TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS "SystemSettings" (
    "Key" VARCHAR(100) PRIMARY KEY,
    "Value" TEXT NOT NULL,
    "Description" VARCHAR(255) NOT NULL DEFAULT '',
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Initial System Settings
INSERT INTO "SystemSettings" ("Key", "Value", "Description") VALUES
('themePreset', 'Slate & Indigo', 'System theme color preset'),
('fontFamily', 'Inter', 'Global font typography family'),
('institutionName', 'OnnoRokom College', 'Institution display header title'),
('maxUploadSizeBytes', '5242880', 'Maximum file upload size limit in bytes (5 MB)'),
('allowedExtensions', '[".pdf",".docx",".zip",".png",".txt"]', 'Allowed submission file extension whitelist'),
('latePenaltyPercentPerDay', '5.00', 'Daily late penalty percentage deduction rate')
ON CONFLICT ("Key") DO NOTHING;

-- 3. Seed Default Classrooms
INSERT INTO "Classrooms" ("Id", "Name", "AcademicYear") VALUES
('11111111-1111-1111-1111-111111111111', 'Class 10-A', '2026'),
('22222222-2222-2222-2222-222222222222', 'Class 12-B', '2026')
ON CONFLICT ("Id") DO NOTHING;

-- 4. Seed Default Users (Password for all demo accounts: Admin123! / Teacher123! / Student123!)
-- Admin: admin@onnorokom.edu
-- Teacher: teacher@onnorokom.edu
-- Student: student@onnorokom.edu
INSERT INTO "Users" ("Id", "FullName", "Email", "PasswordHash", "Role", "ClassroomId") VALUES
('a1111111-1111-1111-1111-111111111111', 'System Administrator', 'admin@onnorokom.edu', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0, NULL),
('b2222222-2222-2222-2222-222222222222', 'Prof. Alan Turing', 'teacher@onnorokom.edu', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NULL),
('c3333333-3333-3333-3333-333333333333', 'Ada Lovelace', 'student@onnorokom.edu', '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, '11111111-1111-1111-1111-111111111111')
ON CONFLICT ("Id") DO NOTHING;

-- 5. Seed Default Subjects
INSERT INTO "Subjects" ("Id", "Name", "Code", "TeacherId") VALUES
('33333333-3333-3333-3333-333333333333', 'Software Engineering', 'CSE402', 'b2222222-2222-2222-2222-222222222222'),
('44444444-4444-4444-4444-444444444444', 'Mathematics & Calculus', 'MATH101', 'b2222222-2222-2222-2222-222222222222')
ON CONFLICT ("Id") DO NOTHING;
