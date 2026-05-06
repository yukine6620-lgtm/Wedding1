using WeddingInvitation2.Application.DTOs.Invitations;

namespace WeddingInvitation2.Application.Interfaces;

public interface IInvitationService
{
    Task<InvitationDto> CreateAsync(Guid userId, CreateInvitationRequest request);
    Task<InvitationDto?> GetBySlugAsync(string slug);
    Task<InvitationDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<InvitationDto>> GetByUserIdAsync(Guid userId);
    Task<InvitationDto?> UpdateAsync(Guid id, Guid userId, UpdateInvitationRequest request);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
