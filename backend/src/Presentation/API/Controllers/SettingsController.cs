using Application.Common.Interfaces;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ISettingService _settingService;

    public SettingsController(ISettingService settingService)
    {
        _settingService = settingService;
    }

    [HttpGet("public")]
    public async Task<IActionResult> GetPublicSettings()
    {
        var theme = await _settingService.GetSettingAsync("ThemePreset", "SlateIndigo");
        var font = await _settingService.GetSettingAsync("FontFamily", "Inter");
        var institution = await _settingService.GetSettingAsync("InstitutionName", "OnnoRokom College");
        var maxUploadSize = await _settingService.GetMaxUploadSizeBytesAsync();
        var allowedExtensions = await _settingService.GetAllowedExtensionsAsync();
        var latePenalty = await _settingService.GetLatePenaltyPercentPerDayAsync();

        var dto = new PublicSettingsDto(
            theme,
            font,
            institution,
            maxUploadSize,
            allowedExtensions,
            latePenalty
        );

        return Ok(dto);
    }

    [HttpPut]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsRequestDto request)
    {
        if (!string.IsNullOrWhiteSpace(request.ThemePreset))
            await _settingService.UpdateSettingAsync("ThemePreset", request.ThemePreset);

        if (!string.IsNullOrWhiteSpace(request.FontFamily))
            await _settingService.UpdateSettingAsync("FontFamily", request.FontFamily);

        if (!string.IsNullOrWhiteSpace(request.InstitutionName))
            await _settingService.UpdateSettingAsync("InstitutionName", request.InstitutionName);

        if (request.MaxUploadSizeBytes.HasValue)
            await _settingService.UpdateSettingAsync("MaxUploadSizeBytes", request.MaxUploadSizeBytes.Value.ToString());

        if (request.AllowedExtensions != null && request.AllowedExtensions.Count > 0)
            await _settingService.UpdateSettingAsync("AllowedExtensions", string.Join(",", request.AllowedExtensions));

        if (request.LatePenaltyPercentPerDay.HasValue)
            await _settingService.UpdateSettingAsync("LatePenaltyPercentPerDay", request.LatePenaltyPercentPerDay.Value.ToString());

        return Ok(new { message = "Settings updated successfully." });
    }
}
