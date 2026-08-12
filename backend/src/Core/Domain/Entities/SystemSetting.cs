using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class SystemSetting
{
    [Key, MaxLength(100)]
    public string Key { get; set; } = string.Empty;
    
    [Required]
    public string Value { get; set; } = string.Empty;
    
    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
