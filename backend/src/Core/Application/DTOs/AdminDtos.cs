using Domain.Enums;

namespace Application.DTOs;

public record CreateUserRequest(
    string FullName,
    string Email,
    string Password,
    UserRole Role,
    Guid? ClassroomId
);

public record UpdateUserRequest(
    string FullName,
    string Email,
    string? Password,
    UserRole Role,
    Guid? ClassroomId
);

public record ClassroomDto(
    Guid Id,
    string Name,
    string AcademicYear,
    int StudentCount
);

public record CreateClassroomRequest(
    string Name,
    string AcademicYear
);

public record SubjectDto(
    Guid Id,
    string Name,
    string Code,
    Guid? TeacherId = null,
    string? TeacherName = null
);

public record CreateSubjectRequest(
    string Name,
    string Code,
    Guid? TeacherId = null
);

public record UpdateSettingRequest(
    string Value
);

public record UpdateSettingsRequestDto(
    string? ThemePreset,
    string? FontFamily,
    string? InstitutionName,
    long? MaxUploadSizeBytes,
    List<string>? AllowedExtensions,
    decimal? LatePenaltyPercentPerDay
);

public record SystemOverviewDto(
    int TotalUsers,
    int TotalTeachers,
    int TotalStudents,
    int TotalClassrooms,
    int TotalSubjects,
    int TotalAssignments,
    int TotalSubmissions
);
