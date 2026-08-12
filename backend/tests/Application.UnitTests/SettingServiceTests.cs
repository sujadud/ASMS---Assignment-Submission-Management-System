using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Shared.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Xunit;

namespace Application.UnitTests;

public class SettingServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new ApplicationDbContext(options);
        return context;
    }

    [Fact]
    public async Task GetSettingAsync_ShouldReturnDefaultValue_WhenSettingDoesNotExist()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var memoryCache = new MemoryCache(new MemoryCacheOptions());
        var service = new SettingService(context, memoryCache);

        // Act
        var val = await service.GetSettingAsync("NonExistentKey", "DefaultFallback");

        // Assert
        Assert.Equal("DefaultFallback", val);
    }

    [Fact]
    public async Task UpdateSettingAsync_ShouldUpdateDatabaseAndInvalidateCache()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        context.SystemSettings.Add(new SystemSetting { Key = "ThemePreset", Value = "SlateIndigo" });
        await context.SaveChangesAsync();

        var memoryCache = new MemoryCache(new MemoryCacheOptions());
        var service = new SettingService(context, memoryCache);

        // Act 1: Initial read populates cache
        var initialTheme = await service.GetSettingAsync("ThemePreset", "Fallback");
        Assert.Equal("SlateIndigo", initialTheme);

        // Act 2: Update setting to CorporateBlue
        await service.UpdateSettingAsync("ThemePreset", "CorporateBlue");
        var updatedTheme = await service.GetSettingAsync("ThemePreset", "Fallback");

        // Assert
        Assert.Equal("CorporateBlue", updatedTheme);
    }

    [Fact]
    public async Task GetAllowedExtensionsAsync_ShouldReturnFormattedExtensionList()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        context.SystemSettings.Add(new SystemSetting { Key = "AllowedExtensions", Value = ".pdf, docx , ZIP " });
        await context.SaveChangesAsync();

        var memoryCache = new MemoryCache(new MemoryCacheOptions());
        var service = new SettingService(context, memoryCache);

        // Act
        var extensions = await service.GetAllowedExtensionsAsync();

        // Assert
        Assert.Equal(3, extensions.Count);
        Assert.Contains(".pdf", extensions);
        Assert.Contains(".docx", extensions);
        Assert.Contains(".zip", extensions);
    }
}
