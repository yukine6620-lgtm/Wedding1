using WeddingInvitation2.Application.DTOs.AI;

namespace WeddingInvitation2.Application.Interfaces;

public interface IAIService
{
    Task<GenerateInvitationResponse> GenerateInvitationAsync(GenerateInvitationRequest request);
}
