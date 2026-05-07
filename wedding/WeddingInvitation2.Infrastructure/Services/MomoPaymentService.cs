using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WeddingInvitation2.Application.DTOs.Payment;
using WeddingInvitation2.Application.Interfaces;
using WeddingInvitation2.Domain.Entities;
using WeddingInvitation2.Infrastructure.Data;

namespace WeddingInvitation2.Infrastructure.Services;

public class MomoPaymentService(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    AppDbContext db,
    ILogger<MomoPaymentService> logger) : IPaymentService
{
    private const long InvitationPrice = 99000; // 99,000 VND

    public async Task<PaymentResponse> CreatePaymentAsync(Guid invitationId, Guid userId, string returnUrl)
    {
        var invitation = await db.Invitations
            .FirstOrDefaultAsync(i => i.Id == invitationId && i.UserId == userId);

        if (invitation is null)
            throw new InvalidOperationException("Invitation not found.");

        if (invitation.Status == InvitationStatus.Paid)
            throw new InvalidOperationException("Invitation already paid.");

        var partnerCode = configuration["MoMo:PartnerCode"] ?? "MOMO";
        var accessKey = configuration["MoMo:AccessKey"] ?? "";
        var secretKey = configuration["MoMo:SecretKey"] ?? "";
        var endpoint = configuration["MoMo:Endpoint"] ?? "https://test-payment.momo.vn/v2/gateway/api/create";
        var ipnUrl = configuration["MoMo:IpnUrl"] ?? "http://localhost:5000/api/payments/momo/webhook";

        var orderId = $"WEDDING_{invitationId}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
        var requestId = Guid.NewGuid().ToString();
        var orderInfo = $"Thanh toán thiệp cưới - {invitation.Title}";
        var extraData = Convert.ToBase64String(Encoding.UTF8.GetBytes(invitationId.ToString()));

        var rawSignature =
            $"accessKey={accessKey}" +
            $"&amount={InvitationPrice}" +
            $"&extraData={extraData}" +
            $"&ipnUrl={ipnUrl}" +
            $"&orderId={orderId}" +
            $"&orderInfo={orderInfo}" +
            $"&partnerCode={partnerCode}" +
            $"&redirectUrl={returnUrl}" +
            $"&requestId={requestId}" +
            $"&requestType=payWithMethod";

        var signature = ComputeHmacSha256(rawSignature, secretKey);

        var requestBody = new
        {
            partnerCode,
            partnerName = "Wedding Invitation",
            storeId = partnerCode,
            requestId,
            amount = InvitationPrice,
            orderId,
            orderInfo,
            redirectUrl = returnUrl,
            ipnUrl,
            lang = "vi",
            requestType = "payWithMethod",
            autoCapture = true,
            extraData,
            orderGroupId = "",
            signature
        };

        var client = httpClientFactory.CreateClient("MoMo");
        var content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        var response = await client.PostAsync(endpoint, content);
        var responseBody = await response.Content.ReadAsStringAsync();

        logger.LogInformation("MoMo create payment response: {Response}", responseBody);

        var doc = JsonDocument.Parse(responseBody);
        var resultCode = doc.RootElement.GetProperty("resultCode").GetInt32();

        if (resultCode != 0)
        {
            var message = doc.RootElement.GetProperty("message").GetString();
            throw new InvalidOperationException($"MoMo error: {message}");
        }

        var payUrl = doc.RootElement.GetProperty("payUrl").GetString() ?? "";

        return new PaymentResponse { PayUrl = payUrl, OrderId = orderId };
    }

    public async Task<bool> HandleWebhookAsync(MomoWebhookPayload payload)
    {
        var accessKey = configuration["MoMo:AccessKey"] ?? "";
        var secretKey = configuration["MoMo:SecretKey"] ?? "";

        // Verify signature
        var rawSignature =
            $"accessKey={accessKey}" +
            $"&amount={payload.Amount}" +
            $"&extraData={payload.ExtraData}" +
            $"&message={payload.Message}" +
            $"&orderId={payload.OrderId}" +
            $"&orderInfo={payload.OrderInfo}" +
            $"&orderType={payload.OrderType}" +
            $"&partnerCode={payload.PartnerCode}" +
            $"&payType={payload.PayType}" +
            $"&requestId={payload.RequestId}" +
            $"&responseTime={payload.ResponseTime}" +
            $"&resultCode={payload.ResultCode}" +
            $"&transId={payload.TransId}";

        var expectedSignature = ComputeHmacSha256(rawSignature, secretKey);

        if (!string.Equals(expectedSignature, payload.Signature, StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning("MoMo webhook signature mismatch. OrderId: {OrderId}", payload.OrderId);
            return false;
        }

        // resultCode == 0 means success
        if (payload.ResultCode != 0)
        {
            logger.LogInformation("MoMo payment failed. OrderId: {OrderId}, Code: {Code}", payload.OrderId, payload.ResultCode);
            return false;
        }

        // Extract invitationId from extraData
        try
        {
            var invitationIdStr = Encoding.UTF8.GetString(Convert.FromBase64String(payload.ExtraData));
            if (!Guid.TryParse(invitationIdStr, out var invitationId))
            {
                logger.LogWarning("Invalid invitationId in extraData: {ExtraData}", payload.ExtraData);
                return false;
            }

            var invitation = await db.Invitations.FirstOrDefaultAsync(i => i.Id == invitationId);
            if (invitation is null) return false;

            invitation.Status = InvitationStatus.Paid;
            invitation.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            logger.LogInformation("Invitation {InvitationId} marked as Paid.", invitationId);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing MoMo webhook.");
            return false;
        }
    }

    private static string ComputeHmacSha256(string data, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        return Convert.ToHexString(hash).ToLower();
    }
}
