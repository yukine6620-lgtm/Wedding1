using Microsoft.EntityFrameworkCore;
using WeddingInvitation2.Application.DTOs.Rsvp;
using WeddingInvitation2.Application.Interfaces;
using WeddingInvitation2.Domain.Entities;
using WeddingInvitation2.Infrastructure.Data;

namespace WeddingInvitation2.Infrastructure.Services;

public class RsvpService(AppDbContext db) : IRsvpService
{
    public async Task<RsvpDto> SubmitAsync(RsvpRequest request)
    {
        // Validate invitation exists
        var invitationExists = await db.Invitations.AnyAsync(i => i.Id == request.InvitationId);
        if (!invitationExists)
            throw new InvalidOperationException("Invitation not found.");

        if (!Enum.TryParse<RsvpStatus>(request.Status, out var status))
            status = RsvpStatus.Attending;

        var rsvp = new Rsvp
        {
            InvitationId = request.InvitationId,
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
            Status = status,
            Message = request.Message.Trim()
        };

        db.Rsvps.Add(rsvp);
        await db.SaveChangesAsync();

        return MapToDto(rsvp);
    }

    public async Task<IEnumerable<RsvpDto>> GetByInvitationIdAsync(Guid invitationId, Guid userId)
    {
        // Only the invitation owner can view RSVPs
        var invitation = await db.Invitations
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.UserId == userId);

        if (invitation is null)
            throw new UnauthorizedAccessException("Access denied.");

        var rsvps = await db.Rsvps
            .AsNoTracking()
            .Where(r => r.InvitationId == invitationId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return rsvps.Select(MapToDto);
    }

    private static RsvpDto MapToDto(Rsvp r) => new()
    {
        Id = r.Id,
        InvitationId = r.InvitationId,
        Name = r.Name,
        Phone = r.Phone,
        Status = r.Status.ToString(),
        Message = r.Message,
        CreatedAt = r.CreatedAt
    };
}
