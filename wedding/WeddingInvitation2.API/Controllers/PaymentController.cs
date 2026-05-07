using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingInvitation2.Application.DTOs.Payment;
using WeddingInvitation2.Application.Interfaces;

namespace WeddingInvitation2.API.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController(IPaymentService paymentService) : ControllerBase
{
    // POST /api/payments/momo — initiate payment (auth required)
    [HttpPost("momo")]
    [Authorize]
    public async Task<IActionResult> CreateMomoPayment([FromBody] PaymentRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        try
        {
            var result = await paymentService.CreatePaymentAsync(
                request.InvitationId,
                userId,
                request.ReturnUrl);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/payments/momo/webhook — MoMo IPN callback (no auth, public)
    [HttpPost("momo/webhook")]
    public async Task<IActionResult> MomoWebhook([FromBody] MomoWebhookPayload payload)
    {
        var success = await paymentService.HandleWebhookAsync(payload);

        // MoMo expects HTTP 204 on success
        return success ? NoContent() : BadRequest();
    }
}
