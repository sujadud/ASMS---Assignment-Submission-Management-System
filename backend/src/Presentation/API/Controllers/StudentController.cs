using Application.Common.Interfaces;
using Application.DTOs;
using Application.Providers;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISettingService _settingService;
    private readonly IStorageProvider _storageProvider;

    public StudentController(
        ApplicationDbContext context,
        ICurrentUserService currentUserService,
        ISettingService settingService,
        IStorageProvider storageProvider)
    {
        _context = context;
        _currentUserService = currentUserService;
        _settingService = settingService;
        _storageProvider = storageProvider;
    }

    [HttpGet("assignments")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyAssignments()
    {
        var studentId = _currentUserService.UserId;
        if (!studentId.HasValue) return Unauthorized();

        var student = await _context.Users.FindAsync(studentId.Value);
        if (student == null || !student.ClassroomId.HasValue)
        {
            return Ok(new List<StudentAssignmentDto>());
        }

        var assignments = await _context.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Subject)
            .Include(a => a.Classroom)
            .Include(a => a.Submissions)
            .Where(a => a.ClassroomId == student.ClassroomId.Value && a.IsPublished)
            .OrderBy(a => a.Deadline)
            .ToListAsync();

        var dtos = assignments.Select(a =>
        {
            var submission = a.Submissions.FirstOrDefault(s => s.StudentId == studentId.Value);
            return new StudentAssignmentDto(
                a.Id,
                a.Title,
                a.Description,
                a.Deadline,
                a.MaxMarks,
                a.Teacher?.FullName ?? "Teacher",
                a.Subject?.Name ?? "Subject",
                a.Classroom?.Name ?? "Class",
                submission != null,
                submission?.Status,
                submission?.MarksObtained,
                submission?.Feedback,
                submission?.SubmittedAt,
                submission?.FilePath,
                submission?.OriginalFileName
            );
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("assignments/{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetAssignmentDetail(Guid id)
    {
        var studentId = _currentUserService.UserId;
        if (!studentId.HasValue) return Unauthorized();

        var assignment = await _context.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Subject)
            .Include(a => a.Classroom)
            .FirstOrDefaultAsync(a => a.Id == id && a.IsPublished);

        if (assignment == null) return NotFound();

        var submission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.AssignmentId == id && s.StudentId == studentId.Value);

        var dto = new StudentAssignmentDto(
            assignment.Id,
            assignment.Title,
            assignment.Description,
            assignment.Deadline,
            assignment.MaxMarks,
            assignment.Teacher?.FullName ?? "Teacher",
            assignment.Subject?.Name ?? "Subject",
            assignment.Classroom?.Name ?? "Class",
            submission != null,
            submission?.Status,
            submission?.MarksObtained,
            submission?.Feedback,
            submission?.SubmittedAt,
            submission?.FilePath,
            submission?.OriginalFileName
        );

        return Ok(dto);
    }

    [HttpPost("assignments/{id}/submit")]
    [Authorize(Roles = "Student")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> SubmitAssignment(Guid id, IFormFile file)
    {
        var studentId = _currentUserService.UserId;
        if (!studentId.HasValue) return Unauthorized();

        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null || !assignment.IsPublished)
        {
            return NotFound(new { message = "Assignment not found or not published." });
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Please select a valid file to upload." });
        }

        // Dynamic Validation via SettingService
        var allowedExtensions = await _settingService.GetAllowedExtensionsAsync();
        var fileExt = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExt))
        {
            return BadRequest(new { message = $"File extension '{fileExt}' is not allowed. Whitelisted extensions: {string.Join(", ", allowedExtensions)}" });
        }

        var maxSizeBytes = await _settingService.GetMaxUploadSizeBytesAsync();
        if (file.Length > maxSizeBytes)
        {
            var maxMb = maxSizeBytes / (1024.0 * 1024.0);
            return BadRequest(new { message = $"File size ({file.Length / (1024.0 * 1024.0):F2} MB) exceeds maximum allowed upload limit of {maxMb:F1} MB." });
        }

        // Check if student already submitted
        var existingSubmission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.AssignmentId == id && s.StudentId == studentId.Value);

        using var stream = file.OpenReadStream();
        var relativePath = await _storageProvider.UploadFileAsync(stream, file.FileName, "assignments");

        if (existingSubmission != null)
        {
            // Resubmission: delete previous file
            if (!string.IsNullOrEmpty(existingSubmission.FilePath))
            {
                await _storageProvider.DeleteFileAsync(existingSubmission.FilePath);
            }

            existingSubmission.FilePath = relativePath;
            existingSubmission.OriginalFileName = file.FileName;
            existingSubmission.FileSizeBytes = file.Length;
            existingSubmission.SubmittedAt = DateTime.UtcNow;
            existingSubmission.Status = SubmissionStatus.Submitted;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Assignment resubmitted successfully.", submissionId = existingSubmission.Id, filePath = relativePath });
        }

        var submission = new Submission
        {
            AssignmentId = id,
            StudentId = studentId.Value,
            FilePath = relativePath,
            OriginalFileName = file.FileName,
            FileSizeBytes = file.Length,
            SubmittedAt = DateTime.UtcNow,
            Status = SubmissionStatus.Submitted
        };

        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Assignment submitted successfully.", submissionId = submission.Id, filePath = relativePath });
    }

    [HttpGet("submissions")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMySubmissions()
    {
        var studentId = _currentUserService.UserId;
        if (!studentId.HasValue) return Unauthorized();

        var submissions = await _context.Submissions
            .Include(s => s.Assignment)
                .ThenInclude(a => a!.Subject)
            .Where(s => s.StudentId == studentId.Value)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => new StudentSubmissionDto(
                s.Id,
                s.AssignmentId,
                s.Assignment != null ? s.Assignment.Title : "Assignment",
                s.Assignment != null && s.Assignment.Subject != null ? s.Assignment.Subject.Name : "Subject",
                s.Assignment != null ? s.Assignment.MaxMarks : 100,
                s.FilePath,
                s.OriginalFileName,
                s.FileSizeBytes,
                s.SubmittedAt,
                s.Status,
                s.MarksObtained,
                s.Feedback,
                s.EvaluatedAt
            ))
            .ToListAsync();

        return Ok(submissions);
    }

    [HttpGet("download/{submissionId}")]
    public async Task<IActionResult> DownloadSubmissionFile(Guid submissionId)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == submissionId);

        if (submission == null) return NotFound();

        var currentUserId = _currentUserService.UserId;
        var currentRole = _currentUserService.UserRole;

        // Security check: only student who submitted, teacher of assignment, or admin can download
        if (currentRole == UserRole.Student && submission.StudentId != currentUserId)
        {
            return Forbid();
        }

        if (currentRole == UserRole.Teacher && submission.Assignment?.TeacherId != currentUserId)
        {
            return Forbid();
        }

        try
        {
            var fileData = await _storageProvider.GetFileAsync(submission.FilePath);
            return File(fileData.Stream, fileData.ContentType, submission.OriginalFileName);
        }
        catch (FileNotFoundException)
        {
            return NotFound(new { message = "The requested file is no longer available on disk." });
        }
    }
}
