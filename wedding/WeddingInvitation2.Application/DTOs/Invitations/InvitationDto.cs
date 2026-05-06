using WeddingInvitation2.Domain.Entities;

namespace WeddingInvitation2.Application.DTOs.Invitations;

public class InvitationDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty;
    public string JsonData { get; set; } = "{}";
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
