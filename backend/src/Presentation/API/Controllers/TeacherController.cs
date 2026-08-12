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
[Authorize(Roles = "Teacher,Admin")]
public class TeacherController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public TeacherController(ApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    [HttpGet("assignments")]
    public async Task<IActionResult> GetAssignments()
    {
        var teacherId = _currentUserService.UserId;
        var query = _context.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Classroom)
            .Include(a => a.Subject)
            .Include(a => a.Submissions)
            .AsQueryable();

        // If Teacher role, filter by teacherId. If Admin, list all.
        if (_currentUserService.UserRole == UserRole.Teacher && teacherId.HasValue)
        {
            query = query.Where(a => a.TeacherId == teacherId.Value);
        }

        var assignments = await query
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AssignmentDto(
                a.Id,
                a.Title,
                a.Description,
                a.Deadline,
                a.MaxMarks,
                a.IsPublished,
                a.TeacherId,
                a.Teacher != null ? a.Teacher.FullName : "Unknown",
                a.ClassroomId,
                a.Classroom != null ? a.Classroom.Name : "Unknown",
                a.SubjectId,
                a.Subject != null ? a.Subject.Name : "Unknown",
                a.Submissions.Count,
                a.CreatedAt
            ))
            .ToListAsync();

        return Ok(assignments);
    }

    [HttpPost("assignments")]
    public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentRequest request)
    {
        var teacherId = _currentUserService.UserId;
        if (!teacherId.HasValue) return Unauthorized();

        var assignment = new Assignment
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Deadline = DateTime.SpecifyKind(request.Deadline, DateTimeKind.Utc),
            MaxMarks = request.MaxMarks,
            IsPublished = request.IsPublished,
            TeacherId = teacherId.Value,
            ClassroomId = request.ClassroomId,
            SubjectId = request.SubjectId
        };

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment created successfully.", id = assignment.Id });
    }

    [HttpPut("assignments/{id}")]
    public async Task<IActionResult> UpdateAssignment(Guid id, [FromBody] UpdateAssignmentRequest request)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return NotFound();

        var teacherId = _currentUserService.UserId;
        if (_currentUserService.UserRole == UserRole.Teacher && assignment.TeacherId != teacherId)
        {
            return Forbid();
        }

        assignment.Title = request.Title.Trim();
        assignment.Description = request.Description.Trim();
        assignment.Deadline = DateTime.SpecifyKind(request.Deadline, DateTimeKind.Utc);
        assignment.MaxMarks = request.MaxMarks;
        assignment.IsPublished = request.IsPublished;
        assignment.ClassroomId = request.ClassroomId;
        assignment.SubjectId = request.SubjectId;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Assignment updated successfully." });
    }

    [HttpPatch("assignments/{id}/publish")]
    public async Task<IActionResult> TogglePublish(Guid id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return NotFound();

        var teacherId = _currentUserService.UserId;
        if (_currentUserService.UserRole == UserRole.Teacher && assignment.TeacherId != teacherId)
        {
            return Forbid();
        }

        assignment.IsPublished = !assignment.IsPublished;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Assignment published state set to {assignment.IsPublished}", isPublished = assignment.IsPublished });
    }

    [HttpDelete("assignments/{id}")]
    public async Task<IActionResult> DeleteAssignment(Guid id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return NotFound();

        var teacherId = _currentUserService.UserId;
        if (_currentUserService.UserRole == UserRole.Teacher && assignment.TeacherId != teacherId)
        {
            return Forbid();
        }

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment deleted successfully." });
    }

    // --- SUBMISSION EVALUATION ---
    [HttpGet("assignments/{id}/submissions")]
    public async Task<IActionResult> GetSubmissionsForAssignment(Guid id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null) return NotFound();

        var submissions = await _context.Submissions
            .Include(s => s.Student)
            .Include(s => s.Assignment)
            .Where(s => s.AssignmentId == id)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        var dtos = submissions.Select(s =>
        {
            var isLate = s.SubmittedAt > assignment.Deadline;
            var daysLate = isLate ? (int)Math.Ceiling((s.SubmittedAt - assignment.Deadline).TotalDays) : 0;

            return new SubmissionReviewDto(
                s.Id,
                s.AssignmentId,
                s.Assignment?.Title ?? string.Empty,
                s.StudentId,
                s.Student?.FullName ?? "Unknown",
                s.Student?.Email ?? string.Empty,
                s.FilePath,
                s.OriginalFileName,
                s.FileSizeBytes,
                s.SubmittedAt,
                isLate,
                daysLate,
                s.Status,
                s.MarksObtained,
                s.Feedback,
                s.EvaluatedAt
            );
        }).ToList();

        return Ok(dtos);
    }

    [HttpPost("submissions/{id}/evaluate")]
    public async Task<IActionResult> EvaluateSubmission(Guid id, [FromBody] EvaluateSubmissionRequest request)
    {
        var submission = await _context.Submissions.FindAsync(id);
        if (submission == null) return NotFound();

        submission.MarksObtained = request.MarksObtained;
        submission.Feedback = request.Feedback?.Trim() ?? string.Empty;
        submission.Status = request.Status;
        submission.EvaluatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Submission evaluated successfully." });
    }
}
