using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Database;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class TokenServices : BaseService, ITokenServices
    {
        private readonly IConfiguration _config;
        private readonly IRepositoryBase<RefreshToken> _refreshToken;
        public TokenServices(IConfiguration config, IRepositoryBase<RefreshToken> refreshToken)
        {
            _config = config;
            _refreshToken = refreshToken;
        }

        public string GenerateToken(UserResponse user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Thêm ID vào token
                new Claim(ClaimTypes.Role, user.RoleName),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireToken"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        public string GenerateRefreshToken(UserResponse user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Thêm ID vào token
                new Claim(ClaimTypes.Role, user.RoleName),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireRefreshToken"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public int? GetUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : null;
        }
        public UserResponse GetUserFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claims = jwtToken.Claims;
            var IdValue = claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
            long id = long.Parse(IdValue);
            var username = claims.FirstOrDefault(c => c.Type == "unique_name")?.Value; // hoặc "unique_name"
            var role = claims.FirstOrDefault(c => c.Type == "role")?.Value;
            return new UserResponse() { 
                Id = id,
                Username = username,
                RoleName = role,
            };
        }
        public AuthToken GetInfoFromToken(string token)
        {
            if (String.IsNullOrEmpty(token))
                return null;

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken = null;
            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch { return null; }

            var claims = jwtToken.Claims;

            var IdValue = claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
            long id = long.Parse(IdValue);
            var username = claims.FirstOrDefault(c => c.Type == "unique_name")?.Value; // hoặc "unique_name"
            var role = claims.FirstOrDefault(c => c.Type == "role")?.Value;
            var expiryDateUnix = claims.FirstOrDefault(c => c.Type == "exp")?.Value;
            var expiryDate = expiryDateUnix != null ? DateTimeOffset.FromUnixTimeSeconds(long.Parse(expiryDateUnix)).DateTime : DateTime.MinValue;

            return new AuthToken()
            {
                Id = id,
                Username = username,
                RoleName = role,
                ExpiryDate = expiryDate
            };
        }
        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out _);

                return principal;
            }
            catch
            {
                return null;
            }
        }
        public static DateTime GetDateTimeFormToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claim = jwtToken.Claims.FirstOrDefault(c => c.Type == "exp");
            return claim != null ? DateTimeOffset.FromUnixTimeSeconds(long.Parse(claim.Value)).DateTime : DateTime.MinValue;
        }
        public string GetRefreshToken(long userId)
        {
            var _token = _refreshToken.Find(f => f.UserId == userId);
            if (_token == null)
                return string.Empty;
            else
                return _token.Token;
        }
        public async Task<HttpResponse> UpdateRefreshToken(RefreshToken info)
        {
            var refreshToken = _refreshToken.Find(x => x.UserId == info.UserId);
            if (refreshToken != null)
            {
                refreshToken.Token = info.Token;
                refreshToken.ExpiryDate = info.ExpiryDate;
                _refreshToken.Update(refreshToken);
            }
            else
            {
                _refreshToken.Insert(info);
            }

            await UnitOfWork.CommitAsync();
            return HttpResponse.OK("Cập nhật token thành công.");
        }
    }
}
