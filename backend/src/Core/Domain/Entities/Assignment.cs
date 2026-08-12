using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Assignment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public DateTime Deadline { get; set; }
    
    public decimal MaxMarks { get; set; } = 100;
    
    public bool IsPublished { get; set; } = false;
    
    public Guid TeacherId { get; set; }
    public User? Teacher { get; set; }
    
    public Guid ClassroomId { get; set; }
    public Classroom? Classroom { get; set; }
    
    public Guid SubjectId { get; set; }
    public Subject? Subject { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
