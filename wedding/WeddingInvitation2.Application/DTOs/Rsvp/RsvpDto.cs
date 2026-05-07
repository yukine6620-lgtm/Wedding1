namespace WeddingInvitation2.Application.DTOs.Rsvp;

public class RsvpDto
{
    public Guid Id { get; set; }
    public Guid InvitationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
