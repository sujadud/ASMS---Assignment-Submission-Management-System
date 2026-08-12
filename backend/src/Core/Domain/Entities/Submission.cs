using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities;

public class Submission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }
    
    public Guid StudentId { get; set; }
    public User? Student { get; set; }
    
    [Required, MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string OriginalFileName { get; set; } = string.Empty;
    
    public long FileSizeBytes { get; set; }
    
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;
    
    public decimal? MarksObtained { get; set; }
    
    public string Feedback { get; set; } = string.Empty;
    
    public DateTime? EvaluatedAt { get; set; }
}
