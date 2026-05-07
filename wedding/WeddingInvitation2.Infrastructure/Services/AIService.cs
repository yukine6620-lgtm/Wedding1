using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WeddingInvitation2.Application.DTOs.AI;
using WeddingInvitation2.Application.Interfaces;

namespace WeddingInvitation2.Infrastructure.Services;

public class AIService(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<AIService> logger) : IAIService
{
    private const int MaxRetries = 2;

    public async Task<GenerateInvitationResponse> GenerateInvitationAsync(GenerateInvitationRequest request)
    {
        var apiKey = configuration["OpenAI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            logger.LogWarning("OpenAI API key not configured. Using template fallback.");
            return BuildFallback(request, "AI chưa được cấu hình, đã dùng template mặc định.");
        }

        var prompt = BuildPrompt(request);

        for (int attempt = 0; attempt <= MaxRetries; attempt++)
        {
            try
            {
                var jsonData = await CallOpenAIAsync(apiKey, prompt);

                if (ValidateJsonSchema(jsonData))
                {
                    return new GenerateInvitationResponse { JsonData = jsonData, IsAiGenerated = true };
                }

                logger.LogWarning("AI returned invalid JSON schema on attempt {Attempt}.", attempt + 1);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "OpenAI call failed on attempt {Attempt}.", attempt + 1);
            }
        }

        // All retries exhausted → fallback
        return BuildFallback(request, "AI không thể tạo thiệp lúc này, đã dùng template mặc định.");
    }

    // --- Private helpers ---

    private async Task<string> CallOpenAIAsync(string apiKey, string prompt)
    {
        var client = httpClientFactory.CreateClient("OpenAI");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var body = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = GetSystemPrompt() },
                new { role = "user", content = prompt }
            },
            temperature = 0.7,
            response_format = new { type = "json_object" }
        };

        var content = new StringContent(
            JsonSerializer.Serialize(body),
            Encoding.UTF8,
            "application/json");

        var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(responseBody);
        var messageContent = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        return messageContent;
    }

    private static string GetSystemPrompt() => """
        You are a wedding invitation content generator. 
        Always respond with a valid JSON object matching this exact schema:
        {
          "version": "1.0",
          "theme": {
            "primaryColor": "<hex color matching the style>",
            "secondaryColor": "<hex color>",
            "font": "<Google Font name>"
          },
          "sections": [
            { "id": "<uuid>", "type": "hero", "data": { "title": "...", "subtitle": "...", "date": "...", "backgroundImage": "" } },
            { "id": "<uuid>", "type": "story", "data": { "title": "...", "content": "..." } },
            { "id": "<uuid>", "type": "event", "data": { "title": "...", "date": "...", "time": "...", "location": "...", "description": "..." } },
            { "id": "<uuid>", "type": "rsvp", "data": { "title": "Xác nhận tham dự" } }
          ]
        }
        Use Vietnamese language for all text content. Generate unique UUIDs for each section id.
        """;

    private static string BuildPrompt(GenerateInvitationRequest r) =>
        $"""
        Tạo thiệp cưới cho cặp đôi:
        - Chú rể: {r.GroomName}
        - Cô dâu: {r.BrideName}
        - Ngày cưới: {r.WeddingDate}
        - Giờ: {r.WeddingTime}
        - Địa điểm: {r.Venue}
        - Phong cách: {r.Style}
        {(r.AdditionalInfo is not null ? $"- Thông tin thêm: {r.AdditionalInfo}" : "")}
        """;

    private static bool ValidateJsonSchema(string json)
    {
        try
        {
            var node = JsonNode.Parse(json);
            if (node is null) return false;

            var hasVersion = node["version"] is not null;
            var hasTheme = node["theme"]?["primaryColor"] is not null;
            var sections = node["sections"]?.AsArray();
            var hasSections = sections is { Count: > 0 };

            return hasVersion && hasTheme && hasSections;
        }
        catch
        {
            return false;
        }
    }

    private static GenerateInvitationResponse BuildFallback(GenerateInvitationRequest r, string warning)
    {
        var heroId = Guid.NewGuid();
        var storyId = Guid.NewGuid();
        var eventId = Guid.NewGuid();
        var rsvpId = Guid.NewGuid();

        var (primaryColor, font) = r.Style switch
        {
            "modern" => ("#2D3748", "Montserrat"),
            "traditional" => ("#8B4513", "Cormorant Garamond"),
            "minimalist" => ("#333333", "Inter"),
            _ => ("#EADBC8", "Playfair Display") // romantic (default)
        };

        var fallbackJson = $$"""
            {
              "version": "1.0",
              "theme": {
                "primaryColor": "{{primaryColor}}",
                "secondaryColor": "#FFFFFF",
                "font": "{{font}}"
              },
              "sections": [
                {
                  "id": "{{heroId}}",
                  "type": "hero",
                  "data": {
                    "title": "{{r.GroomName}} & {{r.BrideName}}",
                    "subtitle": "Trân trọng kính mời",
                    "date": "{{r.WeddingDate}}",
                    "backgroundImage": ""
                  }
                },
                {
                  "id": "{{storyId}}",
                  "type": "story",
                  "data": {
                    "title": "Chuyện tình của chúng tôi",
                    "content": "Hành trình yêu thương của {{r.GroomName}} và {{r.BrideName}} bắt đầu từ những khoảnh khắc bình dị nhất..."
                  }
                },
                {
                  "id": "{{eventId}}",
                  "type": "event",
                  "data": {
                    "title": "Lễ thành hôn",
                    "date": "{{r.WeddingDate}}",
                    "time": "{{r.WeddingTime}}",
                    "location": "{{r.Venue}}",
                    "description": "Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của chúng tôi."
                  }
                },
                {
                  "id": "{{rsvpId}}",
                  "type": "rsvp",
                  "data": {
                    "title": "Xác nhận tham dự"
                  }
                }
              ]
            }
            """;

        return new GenerateInvitationResponse
        {
            JsonData = fallbackJson,
            IsAiGenerated = false,
            Warning = warning
        };
    }
}
