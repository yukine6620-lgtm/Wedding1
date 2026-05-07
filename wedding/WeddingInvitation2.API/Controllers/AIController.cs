using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingInvitation2.Application.DTOs.AI;
using WeddingInvitation2.Application.Interfaces;

namespace WeddingInvitation2.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController(IAIService aiService) : ControllerBase
{
    // POST /api/ai/generate
    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateInvitationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.GroomName) || string.IsNullOrWhiteSpace(request.BrideName))
            return BadRequest(new { message = "Tên cô dâu và chú rể không được để trống." });

        if (string.IsNullOrWhiteSpace(request.WeddingDate))
            return BadRequest(new { message = "Ngày cưới không được để trống." });

        var result = await aiService.GenerateInvitationAsync(request);
        return Ok(result);
    }
}
