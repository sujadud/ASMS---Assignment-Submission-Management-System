using Domain.Enums;

namespace Application.DTOs;

public record AssignmentDto(
    Guid Id,
    string Title,
    string Description,
    DateTime Deadline,
    decimal MaxMarks,
    bool IsPublished,
    Guid TeacherId,
    string TeacherName,
    Guid ClassroomId,
    string ClassroomName,
    Guid SubjectId,
    string SubjectName,
    int SubmissionCount,
    DateTime CreatedAt
);

public record CreateAssignmentRequest(
    string Title,
    string Description,
    DateTime Deadline,
    decimal MaxMarks,
    bool IsPublished,
    Guid ClassroomId,
    Guid SubjectId
);

public record UpdateAssignmentRequest(
    string Title,
    string Description,
    DateTime Deadline,
    decimal MaxMarks,
    bool IsPublished,
    Guid ClassroomId,
    Guid SubjectId
);

public record SubmissionReviewDto(
    Guid Id,
    Guid AssignmentId,
    string AssignmentTitle,
    Guid StudentId,
    string StudentName,
    string StudentEmail,
    string FilePath,
    string OriginalFileName,
    long FileSizeBytes,
    DateTime SubmittedAt,
    bool IsLate,
    int DaysLate,
    SubmissionStatus Status,
    decimal? MarksObtained,
    string Feedback,
    DateTime? EvaluatedAt
);

public record EvaluateSubmissionRequest(
    decimal MarksObtained,
    string Feedback,
    SubmissionStatus Status
);
