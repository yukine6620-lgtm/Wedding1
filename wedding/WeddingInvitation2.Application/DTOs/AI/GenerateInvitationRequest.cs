namespace WeddingInvitation2.Application.DTOs.AI;

public class GenerateInvitationRequest
{
    public string GroomName { get; set; } = string.Empty;
    public string BrideName { get; set; } = string.Empty;
    public string WeddingDate { get; set; } = string.Empty;   // "2025-12-20"
    public string WeddingTime { get; set; } = string.Empty;   // "17:00"
    public string Venue { get; set; } = string.Empty;
    public string Style { get; set; } = "romantic";           // romantic | modern | traditional | minimalist
    public string? AdditionalInfo { get; set; }
}
