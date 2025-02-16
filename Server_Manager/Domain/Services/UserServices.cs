using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ResponseHeader = Microsoft.AspNetCore.Http;

namespace Domain.Services
{
    public class UserServices : BaseService, IUserServices
    {
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Role> _Role;
        private readonly TokenServices _jwtHelper;
        public UserServices(IRepositoryBase<User> user, IRepositoryBase<Role> role, TokenServices jwtHelper)
        {
            _User = user;
            _Role = role;
            _jwtHelper = jwtHelper;
        }

        public async Task<HttpResponse> ChangePassword(ChangePwRequest changePwRequest)
        {
            if(changePwRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            if (changePwRequest.Password != changePwRequest.ConfirmPassword)
                return HttpResponse.Error("Mật khẩu không khớp.", System.Net.HttpStatusCode.BadRequest);

            var user = _User.Find(x => x.Id == changePwRequest.Id);
            if(user != null)
            {
                user.Password = changePwRequest.Password;
                _User.Update(user);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Đổi mật khẩu thành công.");
            }
            else
            {
                return HttpResponse.Error("Tài khoản không tồn tại.", System.Net.HttpStatusCode.BadRequest);
            }
        }


        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var user = _User.Find(x => x.Id == Id);
            if(user == null)
                return HttpResponse.Error("Tài khoản không tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
                return HttpResponse.OK(message: "Xóa tài khoản thành công.");
        }

        public List<UserResponse> GetAllUsers()
        {
            var users = _User.All() 
                .Select(s => new UserResponse()
                {
                    Id = s.Id,
                    Username = s.Username,
                    IsLocked = s.IsLocked,
                    IsVerify = s.IsVerify,
                    RoleName = _Role.Find(_Role => _Role.Id == s.RoleId).DisplayName,
                })
                .ToList();

            return users;   
        }

        public UserResponse GetMe()
        {
            return null;
        }

        public UserResponse GetUserById(long Id)
        {
            var user = _User.All()
                .Select(s => new UserResponse()
                {
                    Id = s.Id,
                    Username = s.Username,
                    IsLocked = s.IsLocked,
                    IsVerify = s.IsVerify,
                    RoleName = _Role.Find(_Role => _Role.Id == s.RoleId).DisplayName,
                })
                .FirstOrDefault();

            return user;
        }

        public async Task<HttpResponse> RefreshToken(string refreshToken)
        {
            var info_token = _jwtHelper.GetInfoFromToken(refreshToken);

            return HttpResponse.OK(info_token, "Tạo token mới thành công.");
        }
    }
}
