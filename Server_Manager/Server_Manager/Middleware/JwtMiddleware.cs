using Domain.Entities;
using Domain.Interfaces.Services;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using Domain.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Server_Manager.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _secretKey;
        private readonly ITokenServices _tokenServices;
        private readonly IUserServices _userServices;
        public JwtMiddleware(RequestDelegate next, IConfiguration config, ITokenServices tokenServices, IUserServices userServices)
        {
            _next = next;
            _secretKey = config["JwtSettings:Secret"];
            _tokenServices = tokenServices;
            _userServices = userServices;
        }

        public async Task Invoke(HttpContext context)
        {
            var bypassRoutes = new[]
            {
                "/auth/login",
                "/auth/sign-up",
                "/auth/refresh-token",
                "/extension/upload",
                "/extension/image",
                "/extension/base64",
            };

            if (bypassRoutes.Contains(context.Request.Path.Value.ToLower()))
            {
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc không tồn tại" });
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                AuthToken AuthInfo = _tokenServices.GetInfoFromToken(token);
                var refresh_token_old = _tokenServices.GetRefreshToken(AuthInfo.Id);
                AuthToken AuthRefreshToken = _tokenServices.GetInfoFromToken(refresh_token_old);
                var dateTimeNow = DateTime.Now;
                if (AuthRefreshToken?.ExpiryDate < dateTimeNow)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { Message = "Refresh Token đã hết hạn" });
                    return;
                }

                if (AuthInfo.ExpiryDate < dateTimeNow)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc đã hết hạn" });
                    return;
                }

                //if (AuthInfo.ExpiryDate < dateTimeNow)
                //{
                //    UserResponse _userJwt = _tokenServices.GetUserFromToken(token);
                //    var access_token = _tokenServices.GenerateToken(_userJwt);
                //    context.Request.Headers["Authorization"] = $"Bearer {access_token}";
                //    var refresh_token = _tokenServices.GenerateRefreshToken(_userJwt);
                //    if (!string.IsNullOrEmpty(refresh_token))
                //    {
                //        await _tokenServices.UpdateRefreshToken(new RefreshToken()
                //        {
                //            UserId = _userJwt.Id,
                //            Token = refresh_token,
                //            ExpiryDate = TokenServices.GetDateTimeFormToken(refresh_token)
                //        });
                //    }
                //}

                var token_exp = authHeader.Substring("Bearer ".Length).Trim();
                //UserResponse _user = _tokenServices.GetUserFromToken(token);
                UserResponse _user = _tokenServices.GetUserFromToken(token);
                if (_user?.Id != null)
                {
                    //UserResponse userResponse = _userServices.GetUserById(_user.Id);
                    if (_user?.IsLocked == true)
                    {
                        context.Response.StatusCode = StatusCodes.Status423Locked;
                        await context.Response.WriteAsJsonAsync(new { Message = "Tài khoản đã bị khóa" });
                        return;
                    }

                    context.Items["UserId"] = _user?.Id;
                    context.Items["RoleName"] = _user?.RoleName;
                    context.Items["SemesterId"] = _user?.SemesterId;

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, _user.Id.ToString()),
                        new Claim(ClaimTypes.Name, _user?.Username),
                        new Claim(ClaimTypes.Role, _user?.RoleName), // Gán role vào Claims
                        new Claim(ClaimTypes.GroupSid, _user?.SemesterId.ToString()) // Gán role vào Claims
                    };

                    var identity = new ClaimsIdentity(claims, "jwt");
                    var claimsPrincipal = new ClaimsPrincipal(identity);

                    context.User = claimsPrincipal; // Thiết lập User cho HttpContext
                }

                await _next(context);

                if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { Message = "Bạn không có quyền truy cập tài nguyên này!" });
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc đã hết hạn" });
            }
        }
    }
}
