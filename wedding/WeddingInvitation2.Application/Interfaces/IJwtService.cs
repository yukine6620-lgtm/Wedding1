using WeddingInvitation2.Domain.Entities;

namespace WeddingInvitation2.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
