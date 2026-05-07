using WeddingInvitation2.Application.DTOs.Payment;

namespace WeddingInvitation2.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse> CreatePaymentAsync(Guid invitationId, Guid userId, string returnUrl);
    Task<bool> HandleWebhookAsync(MomoWebhookPayload payload);
}
