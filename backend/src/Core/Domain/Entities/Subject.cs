using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Subject
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Mathematics", "Software Engineering"
    
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty; // e.g. "MATH101", "CSE402"
    
    public Guid? TeacherId { get; set; }
    public User? Teacher { get; set; }

    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}
