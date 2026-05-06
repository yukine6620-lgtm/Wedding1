using Microsoft.EntityFrameworkCore;
using WeddingInvitation2.Domain.Entities;

namespace WeddingInvitation2.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Invitation> Invitations => Set<Invitation>();
    public DbSet<Rsvp> Rsvps => Set<Rsvp>();
    public DbSet<Template> Templates => Set<Template>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).IsRequired().HasMaxLength(256);
            e.Property(u => u.PasswordHash).IsRequired();
        });

        // Invitation
        modelBuilder.Entity<Invitation>(e =>
        {
            e.HasKey(i => i.Id);
            e.HasIndex(i => i.Slug).IsUnique();
            e.Property(i => i.Slug).IsRequired().HasMaxLength(256);
            e.Property(i => i.Title).IsRequired().HasMaxLength(512);
            e.Property(i => i.JsonData).HasColumnType("jsonb");
            e.Property(i => i.Status).HasConversion<string>();

            e.HasOne(i => i.User)
             .WithMany(u => u.Invitations)
             .HasForeignKey(i => i.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Rsvp
        modelBuilder.Entity<Rsvp>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Name).IsRequired().HasMaxLength(256);
            e.Property(r => r.Status).HasConversion<string>();

            e.HasOne(r => r.Invitation)
             .WithMany(i => i.Rsvps)
             .HasForeignKey(r => r.InvitationId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Template
        modelBuilder.Entity<Template>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Name).IsRequired().HasMaxLength(256);
            e.Property(t => t.JsonData).HasColumnType("jsonb");
        });
    }
}
