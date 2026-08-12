using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Classroom> Classrooms => Set<Classroom>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes & relationships
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            
            entity.HasOne(u => u.Classroom)
                  .WithMany(c => c.Students)
                  .HasForeignKey(u => u.ClassroomId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Assignment relationships
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasOne(a => a.Teacher)
                  .WithMany(u => u.CreatedAssignments)
                  .HasForeignKey(a => a.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Classroom)
                  .WithMany(c => c.Assignments)
                  .HasForeignKey(a => a.ClassroomId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Subject)
                  .WithMany(s => s.Assignments)
                  .HasForeignKey(a => a.SubjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Submission relationships
        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasOne(s => s.Assignment)
                  .WithMany(a => a.Submissions)
                  .HasForeignKey(s => s.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Student)
                  .WithMany(u => u.Submissions)
                  .HasForeignKey(s => s.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // SystemSetting configuration
        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(s => s.Key);
        });
    }
}
