using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.MigrateAsync();

        // 1. Seed System Settings if empty
        if (!await context.SystemSettings.AnyAsync())
        {
            context.SystemSettings.AddRange(new List<SystemSetting>
            {
                new() { Key = "ThemePreset", Value = "SlateIndigo", Description = "Active UI color theme preset" },
                new() { Key = "FontFamily", Value = "Inter", Description = "Active global font family" },
                new() { Key = "MaxUploadSizeBytes", Value = "5242880", Description = "Max allowed file upload size (5 MB)" },
                new() { Key = "AllowedExtensions", Value = ".pdf,.docx,.zip,.txt", Description = "Whitelisted file upload extensions" },
                new() { Key = "LatePenaltyPercentPerDay", Value = "5", Description = "Penalty % deducted per day for late submissions" },
                new() { Key = "InstitutionName", Value = "OnnoRokom College", Description = "Branding name" }
            });
            await context.SaveChangesAsync();
        }

        // 2. Seed Classrooms & Subjects if empty
        if (!await context.Classrooms.AnyAsync())
        {
            var classroomA = new Classroom { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Class 10-A", AcademicYear = "2026" };
            var classroomB = new Classroom { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Class 10-B", AcademicYear = "2026" };
            context.Classrooms.AddRange(classroomA, classroomB);
            await context.SaveChangesAsync();
        }

        if (!await context.Subjects.AnyAsync())
        {
            var subjectMath = new Subject { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Mathematics", Code = "MATH101" };
            var subjectCSE = new Subject { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Software Engineering", Code = "CSE402" };
            context.Subjects.AddRange(subjectMath, subjectCSE);
            await context.SaveChangesAsync();
        }

        // 3. Seed Pre-seeded Users if empty
        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                FullName = "System Administrator",
                Email = "admin@onnorokom.edu",
                PasswordHash = PasswordHasher.HashPassword("Admin@123456"),
                Role = UserRole.Admin
            };

            var teacherUser = new User
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                FullName = "Professor John Teacher",
                Email = "teacher@onnorokom.edu",
                PasswordHash = PasswordHasher.HashPassword("Teacher@123456"),
                Role = UserRole.Teacher
            };

            var studentUser = new User
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                FullName = "Jane Student",
                Email = "student@onnorokom.edu",
                PasswordHash = PasswordHasher.HashPassword("Student@123456"),
                Role = UserRole.Student,
                ClassroomId = Guid.Parse("11111111-1111-1111-1111-111111111111")
            };

            context.Users.AddRange(adminUser, teacherUser, studentUser);
            await context.SaveChangesAsync();

            // 4. Seed sample assignment & submission for instant demo testing
            var sampleAssignment = new Assignment
            {
                Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                Title = "Software Design Patterns & Clean Architecture Essay",
                Description = "Submit a 2-page report explaining Onion Architecture and Strategy Patterns in .NET 8.",
                Deadline = DateTime.UtcNow.AddDays(7),
                MaxMarks = 100,
                IsPublished = true,
                TeacherId = teacherUser.Id,
                ClassroomId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                SubjectId = Guid.Parse("44444444-4444-4444-4444-444444444444")
            };

            context.Assignments.Add(sampleAssignment);
            await context.SaveChangesAsync();
        }
    }
}
