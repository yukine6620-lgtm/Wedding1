namespace WeddingInvitation2.Application.DTOs.Rsvp;

public class RsvpRequest
{
    public Guid InvitationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Status { get; set; } = "Attending"; // Attending | NotAttending | Maybe
    public string Message { get; set; } = string.Empty;
}
