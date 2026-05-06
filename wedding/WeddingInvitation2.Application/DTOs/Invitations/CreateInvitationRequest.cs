using System.ComponentModel.DataAnnotations;

namespace WeddingInvitation2.Application.DTOs.Invitations;

public class CreateInvitationRequest
{
    [Required]
    public string TemplateId { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    public string JsonData { get; set; } = "{}";
}
