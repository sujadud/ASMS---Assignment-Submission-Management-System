using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Classroom
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Class 10-A", "CSE 3rd Year"
    
    [MaxLength(50)]
    public string AcademicYear { get; set; } = string.Empty; // e.g. "2026"
    
    public ICollection<User> Students { get; set; } = new List<User>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}
