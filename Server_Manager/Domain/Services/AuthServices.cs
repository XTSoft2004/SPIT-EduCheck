using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using Microsoft.AspNetCore.Http.Headers;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using ResponseHeader = Microsoft.AspNetCore.Http;

namespace Domain.Services
{
    public class AuthServices : BaseService, IAuthServices
    {
        private readonly IRepositoryBase<RefreshToken> _RefreshToken;
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Role> _Role;
        private readonly IRepositoryBase<Semester> _Semester;
        private readonly ITokenServices _tokenServices;
        private readonly ResponseHeader.HttpContext _httpContext;
        private long UserId { set; get; }
        public AuthServices(IRepositoryBase<RefreshToken> refreshToken, IRepositoryBase<User> user, IRepositoryBase<Semester> semester, IRepositoryBase<Role> role, ITokenServices tokenServices, ResponseHeader.IHttpContextAccessor httpContextAccessor)
        {
            _RefreshToken = refreshToken;
            _User = user;
            _Role = role;
            _Semester = semester;
            _tokenServices = tokenServices;
            _httpContext = httpContextAccessor.HttpContext; // ✅ Lấy HttpContext từ HttpContextAccessor
            UserId = _httpContext.Items["UserId"] == null ? -100 : Convert.ToInt64(_httpContext.Items["UserId"]);
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
                RoleId = -2,
                CreatedDate = DateTime.Now,
                Semester = GetSemesterNow(),
            };
            _User.Insert(user);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo tài khoản thành công.");
        }
        private Semester GetSemesterNow()
        {
            int yearNow = DateTime.Now.Year;
            int monthNow = DateTime.Now.Month;
            int semesterNow;
            int yearStart, yearEnd;

            if (monthNow >= 9 && monthNow <= 12)
            {
                semesterNow = 1;
                yearStart = yearNow;
                yearEnd = yearNow + 1;
            }
            else if (monthNow >= 1 && monthNow <= 5)
            {
                semesterNow = 2;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }
            else // Từ tháng 6 đến đầu tháng 9
            {
                semesterNow = 3;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }

            var semester = _Semester.Find(f => f.YearStart == yearStart
                && f.YearEnd == yearEnd
                && f.Semesters_Number == semesterNow);

            return semester;
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
                    SemesterId = _user.SemesterId
                    //RoleName = _user.Role?.DisplayName
                };
                user.AccessToken = _tokenServices.GenerateToken(user);
                user.RefreshToken = _tokenServices.GenerateRefreshToken(user);

                await _tokenServices.UpdateRefreshToken(new RefreshToken()
                {
                    UserId = user.Id,
                    Token = user.RefreshToken,
                    ExpiryDate = TokenServices.GetDateTimeFormToken(user.RefreshToken),
                    SemesterId = _user.SemesterId
                });

                return HttpResponse.OK(user, "Đăng nhập thành công.");
            }
        }

        public async Task<HttpResponse> LogoutAsync()
        {
            var user = _User.Find(x => x.Id == UserId);
            if(user != null)
            {
                var refreshToken = _RefreshToken.Find(x => x.UserId == UserId);
                if (refreshToken != null)
                {
                    _RefreshToken.Delete(refreshToken);
                    await UnitOfWork.CommitAsync();
                    return HttpResponse.OK(message: "Đăng xuất thành công.");
                }
            }
            return HttpResponse.Error("Đăng xuất thất bại, vui lòng thử lại.", System.Net.HttpStatusCode.BadRequest);
        }

        public async Task<HttpResponse> RefreshToken(string token)
        {
            var InfoToken = _tokenServices.GetInfoFromToken(token);
            if(InfoToken != null && (InfoToken.ExpiryDate > DateTime.Now))
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
