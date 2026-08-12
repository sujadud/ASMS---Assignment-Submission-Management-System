using Domain.Enums;

namespace Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserEmail { get; }
    UserRole? UserRole { get; }
    bool IsAuthenticated { get; }
}
