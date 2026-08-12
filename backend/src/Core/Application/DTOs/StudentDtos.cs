using Domain.Enums;

namespace Application.DTOs;

public record StudentAssignmentDto(
    Guid Id,
    string Title,
    string Description,
    DateTime Deadline,
    decimal MaxMarks,
    string TeacherName,
    string SubjectName,
    string ClassroomName,
    bool HasSubmitted,
    SubmissionStatus? SubmissionStatus,
    decimal? MarksObtained,
    string? Feedback,
    DateTime? SubmittedAt,
    string? SubmittedFilePath,
    string? SubmittedFileName
);

public record StudentSubmissionDto(
    Guid Id,
    Guid AssignmentId,
    string AssignmentTitle,
    string SubjectName,
    decimal MaxMarks,
    string FilePath,
    string OriginalFileName,
    long FileSizeBytes,
    DateTime SubmittedAt,
    SubmissionStatus Status,
    decimal? MarksObtained,
    string Feedback,
    DateTime? EvaluatedAt
);

public record PublicSettingsDto(
    string ThemePreset,
    string FontFamily,
    string InstitutionName,
    long MaxUploadSizeBytes,
    List<string> AllowedExtensions,
    decimal LatePenaltyPercentPerDay
);
