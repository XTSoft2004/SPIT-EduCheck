using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;

namespace Domain.Services
{
    public class AuthServices : BaseService, IAuthServices
    {
        private readonly IRepositoryBase<RefreshToken> _RefreshToken;
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Role> _Role;
        private readonly ITokenServices _tokenServices;

        public AuthServices(IRepositoryBase<RefreshToken> refreshToken, IRepositoryBase<User> user, IRepositoryBase<Role> role, ITokenServices tokenServices)
        {
            _RefreshToken = refreshToken;
            _User = user;
            _Role = role;
            _tokenServices = tokenServices;
        }

        public async Task<HttpResponse> CreateAsync(RegisterRequest registerRequest)
        {
            if (registerRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _user = _User.Find(x => x.Username == registerRequest.Username);
            if (_user != null)
                return HttpResponse.Error("Tên tài khoản đã tồn tại.", System.Net.HttpStatusCode.BadRequest);

            User user = new User()
            {
                Username = registerRequest.Username,
                Password = registerRequest.Password,
                RoleId = -2
            };
            _User.Insert(user);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo tài khoản thành công.");
        }

        public async Task<HttpResponse> LoginAsync(LoginDTO loginDTO)
        {
            if (loginDTO == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _user = _User.Find(x => x.Username == loginDTO.Username);
            if (_user == null)
                return HttpResponse.Error("Tài khoản hoặc mật khẩu không đúng.", System.Net.HttpStatusCode.BadRequest);
            else if (_user.Password != loginDTO.Password)
                return HttpResponse.Error("Sai mật khẩu.");
            else
            {
                var user = new UserResponse()
                {
                    Id = _user.Id,
                    Username = _user.Username,
                    IsLocked = _user.IsLocked,
                    IsVerify = _user.IsVerify,
                    RoleName = _Role.Find(_Role => _Role.Id == _user.RoleId).DisplayName,
                };
                user.AccessToken = _tokenServices.GenerateToken(user);
                user.RefreshToken = _tokenServices.GenerateRefreshToken(user);
               
                return HttpResponse.OK(user, "Đăng nhập thành công.");
            }
        }

        public async Task<HttpResponse> RefreshToken(string refreshToken)
        {
            var InfoToken = _tokenServices.GetInfoFromToken(refreshToken);
            if(InfoToken != null && InfoToken.refreshToken != null && InfoToken.refreshToken.ExpiryDate > DateTime.UtcNow)
            {
                var user = _User.Find(x => x.Id == InfoToken.Id);
                if (user != null)
                {
                    var userResponse = new UserResponse()
                    {
                        Id = user.Id,
                        Username = user.Username,
                        IsLocked = user.IsLocked,
                        IsVerify = user.IsVerify,
                        RoleName = _Role.Find(_Role => _Role.Id == user.RoleId).DisplayName,
                    };
                    userResponse.AccessToken = _tokenServices.GenerateToken(userResponse);
                    userResponse.RefreshToken = _tokenServices.GenerateRefreshToken(userResponse);
                    await _tokenServices.UpdateRefreshToken(new RefreshToken()
                    {
                        UserId = user.Id,
                        Token = userResponse.RefreshToken,
                        ExpiryDate = TokenServices.GetDateTimeFormToken(userResponse.RefreshToken)
                    });
                    return HttpResponse.OK(userResponse, "Lấy token mới thành công.");
                }
            }
            return HttpResponse.Error("Token không hợp lệ, vui lòng kiểm tra lại", System.Net.HttpStatusCode.BadRequest);
        }
    }
}
