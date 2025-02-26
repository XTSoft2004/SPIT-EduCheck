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
        private readonly IRepositoryBase<Student> _Student;
        private readonly ITokenServices _jwtHelper;
        private readonly ResponseHeader.HttpContext _httpContext;
        private long UserId { set; get; }
        public UserServices(
            IRepositoryBase<User> user,
            IRepositoryBase<Role> role,
            IRepositoryBase<Student> student,
            ITokenServices jwtHelper,
            ResponseHeader.IHttpContextAccessor httpContextAccessor)
        {
            _User = user;
            _Role = role;
            _Student = student;
            _jwtHelper = jwtHelper;
            _httpContext = httpContextAccessor.HttpContext; // ✅ Lấy HttpContext từ HttpContextAccessor
            UserId = _httpContext.Items["UserId"] == null ? -100 : Convert.ToInt64(_httpContext.Items["UserId"]);
        }

        public async Task<HttpResponse> ChangePassword(ChangePwRequest changePwRequest)
        {
            if (changePwRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            if (changePwRequest.Password != changePwRequest.ConfirmPassword)
                return HttpResponse.Error("Mật khẩu không khớp.", System.Net.HttpStatusCode.BadRequest);

            var user = _User.Find(x => x.Id == UserId);
            if (user != null)
            {
                if (user.Password != changePwRequest.OldPassword)
                    return HttpResponse.Error("Mật khẩu cũ không đúng.", System.Net.HttpStatusCode.BadRequest);

                user.Password = changePwRequest.Password;
                user.ModifiedDate = DateTime.Now;
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
            if (user == null)
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
                    RoleName = s.Role.DisplayName,
                    StudentName = s.Student != null ? (s.Student.FirstName + " " + s.Student.LastName) : null
                })
                .ToList();

            return users;
        }

        public UserResponse GetMe()
        {
            var user = _User.Find(f => f.Id == UserId);
            if (user != null)
            {
                var userResponse = new UserResponse()
                {
                    Id = user.Id,
                    Username = user.Username,
                    IsLocked = user.IsLocked,
                    IsVerify = user.IsVerify,
                    RoleName = _Role.Find(x => x.Id == user.RoleId)?.DisplayName,
                    StudentName = _Student.Find(f => f.Id == user.StudentId) != null ? _Student.Find(f => f.Id == user.StudentId).FirstName + " " + _Student.Find(f => f.Id == user.StudentId).LastName : null
                };
                return userResponse;
            }
            return null;
        }

        public UserResponse GetUserById(long Id)
        {
            var user = _User.Find(w => w.Id == Id);
            if (user != null)
            {
                var userResponse = new UserResponse()
                {
                    Id = user.Id,
                    Username = user.Username,
                    IsLocked = user.IsLocked,
                    IsVerify = user.IsVerify,
                    RoleName = _Role.Find(x => x.Id == user.RoleId)?.DisplayName,
                    StudentName = _Student.Find(f => f.Id == user.StudentId) != null ? _Student.Find(f => f.Id == user.StudentId).FirstName + " " + _Student.Find(f => f.Id == user.StudentId).LastName : null
                };

                return userResponse;
            }
            return null;
        }
    }
}
