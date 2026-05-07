using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingInvitation2.Application.DTOs.Rsvp;
using WeddingInvitation2.Application.Interfaces;

namespace WeddingInvitation2.API.Controllers;

[ApiController]
[Route("api/rsvp")]
public class RsvpController(IRsvpService rsvpService) : ControllerBase
{
    // POST /api/rsvp — public, no auth required
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] RsvpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên không được để trống." });

        try
        {
            var result = await rsvpService.SubmitAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // GET /api/rsvp/{invitationId} — owner only
    [HttpGet("{invitationId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetByInvitation(Guid invitationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        try
        {
            var rsvps = await rsvpService.GetByInvitationIdAsync(invitationId, userId);
            return Ok(rsvps);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
