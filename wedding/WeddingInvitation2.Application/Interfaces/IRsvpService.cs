using WeddingInvitation2.Application.DTOs.Rsvp;

namespace WeddingInvitation2.Application.Interfaces;

public interface IRsvpService
{
    Task<RsvpDto> SubmitAsync(RsvpRequest request);
    Task<IEnumerable<RsvpDto>> GetByInvitationIdAsync(Guid invitationId, Guid userId);
}
