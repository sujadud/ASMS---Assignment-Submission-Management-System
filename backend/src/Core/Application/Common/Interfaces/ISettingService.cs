using Domain.Entities;

namespace Application.Common.Interfaces;

public interface ISettingService
{
    Task<string> GetSettingAsync(string key, string defaultValue = "");
    Task<T> GetSettingAsync<T>(string key, T defaultValue);
    Task<Dictionary<string, string>> GetAllSettingsAsync();
    Task UpdateSettingAsync(string key, string value);
    Task<List<string>> GetAllowedExtensionsAsync();
    Task<long> GetMaxUploadSizeBytesAsync();
    Task<decimal> GetLatePenaltyPercentPerDayAsync();
}
