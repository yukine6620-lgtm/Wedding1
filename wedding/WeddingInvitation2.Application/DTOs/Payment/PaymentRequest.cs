namespace WeddingInvitation2.Application.DTOs.Payment;

public class PaymentRequest
{
    public Guid InvitationId { get; set; }
    public string ReturnUrl { get; set; } = string.Empty; // frontend redirect after payment
}
