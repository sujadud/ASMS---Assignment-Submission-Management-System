using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public UserRole Role { get; set; }
    
    public Guid? ClassroomId { get; set; }
    public Classroom? Classroom { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Assignment> CreatedAssignments { get; set; } = new List<Assignment>();
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
