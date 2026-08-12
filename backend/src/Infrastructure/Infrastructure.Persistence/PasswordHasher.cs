using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Persistence;

public static class PasswordHasher
{
    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "ASMS_SALT_2026"));
        return Convert.ToBase64String(bytes);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }
}
