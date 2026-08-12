using Domain.Enums;

namespace Application.DTOs;

public record LoginRequest(string Email, string Password);

public record UserDto(
    Guid Id,
    string FullName,
    string Email,
    UserRole Role,
    Guid? ClassroomId,
    string? ClassroomName,
    DateTime CreatedAt
);

public record LoginResponse(
    string Token,
    UserDto User
);
