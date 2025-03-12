using Domain.Common.Http;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IAuthServices
    {
        Task<HttpResponse> LoginAsync(LoginDTO loginDTO);
        Task<HttpResponse> CreateAsync(RegisterRequest register);
        Task<HttpResponse> RefreshToken(string refreshToken);
        Task<HttpResponse> LogoutAsync();
    }
}
