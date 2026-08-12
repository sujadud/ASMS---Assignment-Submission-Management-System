using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Shared.Services;

public class SettingService : ISettingService
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private const string ALL_SETTINGS_CACHE_KEY = "SystemSettings_All_Dict";

    public SettingService(ApplicationDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Dictionary<string, string>> GetAllSettingsAsync()
    {
        if (_cache.TryGetValue(ALL_SETTINGS_CACHE_KEY, out Dictionary<string, string>? cachedSettings) && cachedSettings != null)
        {
            return cachedSettings;
        }

        var settings = await _context.SystemSettings.ToDictionaryAsync(s => s.Key, s => s.Value);
        _cache.Set(ALL_SETTINGS_CACHE_KEY, settings, TimeSpan.FromHours(1));
        return settings;
    }

    public async Task<string> GetSettingAsync(string key, string defaultValue = "")
    {
        var settings = await GetAllSettingsAsync();
        return settings.TryGetValue(key, out var val) ? val : defaultValue;
    }

    public async Task<T> GetSettingAsync<T>(string key, T defaultValue)
    {
        var val = await GetSettingAsync(key, string.Empty);
        if (string.IsNullOrEmpty(val)) return defaultValue;

        try
        {
            return (T)Convert.ChangeType(val, typeof(T));
        }
        catch
        {
            return defaultValue;
        }
    }

    public async Task UpdateSettingAsync(string key, string value)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            setting = new SystemSetting
            {
                Key = key,
                Value = value,
                UpdatedAt = DateTime.UtcNow
            };
            _context.SystemSettings.Add(setting);
        }
        else
        {
            setting.Value = value;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        _cache.Remove(ALL_SETTINGS_CACHE_KEY);
    }

    public async Task<List<string>> GetAllowedExtensionsAsync()
    {
        var val = await GetSettingAsync("AllowedExtensions", ".pdf,.docx,.zip,.txt");
        return val.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                  .Select(e => e.StartsWith(".") ? e.ToLower() : "." + e.ToLower())
                  .ToList();
    }

    public async Task<long> GetMaxUploadSizeBytesAsync()
    {
        var valStr = await GetSettingAsync("MaxUploadSizeBytes", "5242880");
        return long.TryParse(valStr, out var bytes) ? bytes : 5242880;
    }

    public async Task<decimal> GetLatePenaltyPercentPerDayAsync()
    {
        var valStr = await GetSettingAsync("LatePenaltyPercentPerDay", "5");
        return decimal.TryParse(valStr, out var p) ? p : 5m;
    }
}
