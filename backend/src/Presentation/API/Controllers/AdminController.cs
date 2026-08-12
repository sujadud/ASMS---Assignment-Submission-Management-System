using Application.Common.Interfaces;
using Application.DTOs;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ISettingService _settingService;

    public AdminController(ApplicationDbContext context, ISettingService settingService)
    {
        _context = context;
        _settingService = settingService;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetSystemOverview()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalTeachers = await _context.Users.CountAsync(u => u.Role == UserRole.Teacher);
        var totalStudents = await _context.Users.CountAsync(u => u.Role == UserRole.Student);
        var totalClassrooms = await _context.Classrooms.CountAsync();
        var totalSubjects = await _context.Subjects.CountAsync();
        var totalAssignments = await _context.Assignments.CountAsync();
        var totalSubmissions = await _context.Submissions.CountAsync();

        var dto = new SystemOverviewDto(
            totalUsers,
            totalTeachers,
            totalStudents,
            totalClassrooms,
            totalSubjects,
            totalAssignments,
            totalSubmissions
        );

        return Ok(dto);
    }

    // --- USER MANAGEMENT ---
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Classroom)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserDto(
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.ClassroomId,
                u.Classroom != null ? u.Classroom.Name : null,
                u.CreatedAt
            ))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower()))
        {
            return BadRequest(new { message = "User with this email already exists." });
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLower(),
            PasswordHash = PasswordHasher.HashPassword(request.Password),
            Role = request.Role,
            ClassroomId = request.Role == UserRole.Student ? request.ClassroomId : null
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully.", userId = user.Id });
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.FullName = request.FullName.Trim();
        user.Email = request.Email.Trim().ToLower();
        user.Role = request.Role;
        user.ClassroomId = request.Role == UserRole.Student ? request.ClassroomId : null;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = PasswordHasher.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "User updated successfully." });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deleted successfully." });
    }

    // --- ACADEMICS: CLASSROOMS ---
    [HttpGet("classrooms")]
    public async Task<IActionResult> GetClassrooms()
    {
        var classrooms = await _context.Classrooms
            .Include(c => c.Students)
            .Select(c => new ClassroomDto(c.Id, c.Name, c.AcademicYear, c.Students.Count))
            .ToListAsync();

        return Ok(classrooms);
    }

    [HttpPost("classrooms")]
    public async Task<IActionResult> CreateClassroom([FromBody] CreateClassroomRequest request)
    {
        var classroom = new Classroom
        {
            Name = request.Name.Trim(),
            AcademicYear = request.AcademicYear.Trim()
        };

        _context.Classrooms.Add(classroom);
        await _context.SaveChangesAsync();

        return Ok(new ClassroomDto(classroom.Id, classroom.Name, classroom.AcademicYear, 0));
    }

    [HttpPut("classrooms/{id}")]
    public async Task<IActionResult> UpdateClassroom(Guid id, [FromBody] CreateClassroomRequest request)
    {
        var classroom = await _context.Classrooms.FindAsync(id);
        if (classroom == null) return NotFound();

        classroom.Name = request.Name.Trim();
        classroom.AcademicYear = request.AcademicYear.Trim();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Classroom updated successfully." });
    }

    [HttpDelete("classrooms/{id}")]
    public async Task<IActionResult> DeleteClassroom(Guid id)
    {
        var classroom = await _context.Classrooms.FindAsync(id);
        if (classroom == null) return NotFound();

        _context.Classrooms.Remove(classroom);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Classroom deleted successfully." });
    }

    // --- ACADEMICS: SUBJECTS ---
    [HttpGet("subjects")]
    public async Task<IActionResult> GetSubjects()
    {
        var subjects = await _context.Subjects
            .Select(s => new SubjectDto(s.Id, s.Name, s.Code))
            .ToListAsync();

        return Ok(subjects);
    }

    [HttpPost("subjects")]
    public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectRequest request)
    {
        var subject = new Subject
        {
            Name = request.Name.Trim(),
            Code = request.Code.Trim().ToUpper()
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return Ok(new SubjectDto(subject.Id, subject.Name, subject.Code));
    }

    [HttpPut("subjects/{id}")]
    public async Task<IActionResult> UpdateSubject(Guid id, [FromBody] CreateSubjectRequest request)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null) return NotFound();

        subject.Name = request.Name.Trim();
        subject.Code = request.Code.Trim().ToUpper();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Subject updated successfully." });
    }

    [HttpDelete("subjects/{id}")]
    public async Task<IActionResult> DeleteSubject(Guid id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null) return NotFound();

        _context.Subjects.Remove(subject);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Subject deleted successfully." });
    }

    // --- SYSTEM SETTINGS MANAGEMENT ---
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _settingService.GetAllSettingsAsync();
        return Ok(settings);
    }

    [HttpPut("settings/{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] UpdateSettingRequest request)
    {
        await _settingService.UpdateSettingAsync(key, request.Value);
        return Ok(new { message = $"Setting '{key}' updated to '{request.Value}' successfully." });
    }
}
