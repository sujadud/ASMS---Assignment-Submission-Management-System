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
    string Code
);

public record CreateSubjectRequest(
    string Name,
    string Code
);

public record UpdateSettingRequest(
    string Value
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
