using Domain.Common.Http;
using Domain.Entities;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ITokenServices
    {
        string GenerateToken(UserResponse user);
        string GenerateRefreshToken(UserResponse user);
        AuthToken GetInfoFromToken(string token);
        ClaimsPrincipal? ValidateToken(string token);
        Task<HttpResponse> UpdateRefreshToken(RefreshToken info);
        UserResponse GetUserFromToken(string token);
        string GetRefreshToken(long userId);
        //Task<HttpResponse> RefreshToken(string refreshToken);
    }
}
