using Microsoft.EntityFrameworkCore;
using WeddingInvitation2.Application.DTOs.Invitations;
using WeddingInvitation2.Application.Interfaces;
using WeddingInvitation2.Domain.Entities;
using WeddingInvitation2.Infrastructure.Data;

namespace WeddingInvitation2.Infrastructure.Services;

public class InvitationService(AppDbContext db) : IInvitationService
{
    public async Task<InvitationDto> CreateAsync(Guid userId, CreateInvitationRequest request)
    {
        var slug = await GenerateUniqueSlugAsync(request.Title);

        var invitation = new Invitation
        {
            UserId = userId,
            Slug = slug,
            Title = request.Title,
            TemplateId = request.TemplateId,
            JsonData = request.JsonData
        };

        db.Invitations.Add(invitation);
        await db.SaveChangesAsync();

        return MapToDto(invitation);
    }

    public async Task<InvitationDto?> GetBySlugAsync(string slug)
    {
        var invitation = await db.Invitations
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Slug == slug);

        return invitation is null ? null : MapToDto(invitation);
    }

    public async Task<InvitationDto?> GetByIdAsync(Guid id)
    {
        var invitation = await db.Invitations
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

        return invitation is null ? null : MapToDto(invitation);
    }

    public async Task<IEnumerable<InvitationDto>> GetByUserIdAsync(Guid userId)
    {
        var invitations = await db.Invitations
            .AsNoTracking()
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.UpdatedAt)
            .ToListAsync();

        return invitations.Select(MapToDto);
    }

    public async Task<InvitationDto?> UpdateAsync(Guid id, Guid userId, UpdateInvitationRequest request)
    {
        var invitation = await db.Invitations
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

        if (invitation is null) return null;

        if (request.Title is not null) invitation.Title = request.Title;
        if (request.JsonData is not null) invitation.JsonData = request.JsonData;
        invitation.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToDto(invitation);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var invitation = await db.Invitations
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

        if (invitation is null) return false;

        db.Invitations.Remove(invitation);
        await db.SaveChangesAsync();
        return true;
    }

    // --- Helpers ---

    private async Task<string> GenerateUniqueSlugAsync(string title)
    {
        var baseSlug = GenerateSlug(title);
        var slug = baseSlug;
        var counter = 1;

        while (await db.Invitations.AnyAsync(i => i.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        return slug;
    }

    private static string GenerateSlug(string title)
    {
        // Normalize Vietnamese characters to ASCII-friendly slug
        var slug = title.ToLower()
            .Replace(" ", "-")
            .Replace("&", "and");

        // Remove characters that are not alphanumeric or hyphens
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-").Trim('-');

        return string.IsNullOrEmpty(slug) ? "wedding" : slug;
    }

    private static InvitationDto MapToDto(Invitation i) => new()
    {
        Id = i.Id,
        Slug = i.Slug,
        Title = i.Title,
        TemplateId = i.TemplateId,
        JsonData = i.JsonData,
        Status = i.Status.ToString(),
        CreatedAt = i.CreatedAt,
        UpdatedAt = i.UpdatedAt
    };
}
