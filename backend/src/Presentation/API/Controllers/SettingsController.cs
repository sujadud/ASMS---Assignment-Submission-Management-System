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
}
