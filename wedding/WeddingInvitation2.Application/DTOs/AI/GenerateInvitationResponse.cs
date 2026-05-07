namespace WeddingInvitation2.Application.DTOs.AI;

public class GenerateInvitationResponse
{
    public string JsonData { get; set; } = string.Empty;
    public bool IsAiGenerated { get; set; } = true;
    public string? Warning { get; set; } // set if fallback was used
}
