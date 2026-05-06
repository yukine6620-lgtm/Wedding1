using WeddingInvitation2.Application.DTOs.Auth;

namespace WeddingInvitation2.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
