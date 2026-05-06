namespace WeddingInvitation2.Domain.Entities;

public class Rsvp
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid InvitationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public RsvpStatus Status { get; set; } = RsvpStatus.Attending;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Invitation Invitation { get; set; } = null!;
}

public enum RsvpStatus
{
    Attending,
    NotAttending,
    Maybe
}
