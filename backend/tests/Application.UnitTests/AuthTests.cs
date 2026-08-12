using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Infrastructure.Shared.Security;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Application.UnitTests;

public class AuthTests
{
    [Fact]
    public void PasswordHasher_ShouldHashAndVerifyPasswordSuccessfully()
    {
        // Arrange
        var password = "SecurePassword@123";

        // Act
        var hash = PasswordHasher.HashPassword(password);
        var isValid = PasswordHasher.VerifyPassword(password, hash);
        var isInvalid = PasswordHasher.VerifyPassword("WrongPassword", hash);

        // Assert
        Assert.NotNull(hash);
        Assert.True(isValid);
        Assert.False(isInvalid);
    }

    [Fact]
    public void JwtTokenGenerator_ShouldGenerateValidTokenForUser()
    {
        // Arrange
        var inMemoryConfig = new Dictionary<string, string?>
        {
            { "JwtSettings:SecretKey", "SuperSecretKeyForJWTTokenAuthenticationAssignmentSystem2026!" },
            { "JwtSettings:Issuer", "OnnoRokomAPI" },
            { "JwtSettings:Audience", "OnnoRokomClient" },
            { "JwtSettings:ExpiryMinutes", "60" }
        };

        IConfiguration config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemoryConfig)
            .Build();

        var generator = new JwtTokenGenerator(config);
        var testUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Test Teacher",
            Email = "teacher@test.com",
            Role = UserRole.Teacher
        };

        // Act
        var token = generator.GenerateToken(testUser);

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.Contains(".", token); // JWT has 3 parts separated by dot
    }
}
