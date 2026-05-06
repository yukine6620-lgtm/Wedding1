namespace WeddingInvitation2.Domain.Entities;

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty;
    public string JsonData { get; set; } = "{}";
    public InvitationStatus Status { get; set; } = InvitationStatus.Draft;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Rsvp> Rsvps { get; set; } = new List<Rsvp>();
}

public enum InvitationStatus
{
    Draft,
    Published,
    Paid
}
