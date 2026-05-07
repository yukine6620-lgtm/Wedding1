using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WeddingInvitation2.Application.Interfaces;
using WeddingInvitation2.Infrastructure.Data;
using WeddingInvitation2.Infrastructure.Services;

namespace WeddingInvitation2.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // HTTP clients
        services.AddHttpClient("OpenAI");
        services.AddHttpClient("MoMo");

        // Services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IInvitationService, InvitationService>();
        services.AddScoped<IRsvpService, RsvpService>();
        services.AddScoped<IAIService, AIService>();
        services.AddScoped<IPaymentService, MomoPaymentService>();

        return services;
    }
}
