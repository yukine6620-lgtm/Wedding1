using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingInvitation2.Application.DTOs.Invitations;
using WeddingInvitation2.Application.Interfaces;

namespace WeddingInvitation2.API.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController(IInvitationService invitationService) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/invitations (my invitations)
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMyInvitations()
    {
        var invitations = await invitationService.GetByUserIdAsync(CurrentUserId);
        return Ok(invitations);
    }

    // GET /api/invitations/{slug} (public — no auth required)
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var invitation = await invitationService.GetBySlugAsync(slug);
        if (invitation is null) return NotFound();
        return Ok(invitation);
    }

    // POST /api/invitations
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateInvitationRequest request)
    {
        var invitation = await invitationService.CreateAsync(CurrentUserId, request);
        return CreatedAtAction(nameof(GetBySlug), new { slug = invitation.Slug }, invitation);
    }

    // PUT /api/invitations/{id}
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvitationRequest request)
    {
        var invitation = await invitationService.UpdateAsync(id, CurrentUserId, request);
        if (invitation is null) return NotFound();
        return Ok(invitation);
    }

    // DELETE /api/invitations/{id}
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await invitationService.DeleteAsync(id, CurrentUserId);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
