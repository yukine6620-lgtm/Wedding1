using Microsoft.EntityFrameworkCore;
using WeddingInvitation2.Application.DTOs.Auth;
using WeddingInvitation2.Application.Interfaces;
using WeddingInvitation2.Domain.Entities;
using WeddingInvitation2.Infrastructure.Data;

namespace WeddingInvitation2.Infrastructure.Services;

public class AuthService(AppDbContext db, IJwtService jwtService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var exists = await db.Users.AnyAsync(u => u.Email == request.Email.ToLower());
        if (exists)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = jwtService.GenerateToken(user),
            User = new UserDto { Id = user.Id, Email = user.Email }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return new AuthResponse
        {
            Token = jwtService.GenerateToken(user),
            User = new UserDto { Id = user.Id, Email = user.Email }
        };
    }
}
