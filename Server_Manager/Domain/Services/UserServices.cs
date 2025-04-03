using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IRepositoryBase<Semester> _Semester;
        private readonly IRepositoryBase<Timesheet_Students> _TimeSheetStudets;
        private readonly ITokenServices _jwtHelper;
        private readonly ITokenServices _Token;
        private readonly IHttpContextHelper _HttpContextHelper;
        private long UserId { set; get; }
        public UserServices(
            IRepositoryBase<User> user,
            IRepositoryBase<Role> role,
            IRepositoryBase<Semester> semester,
            IRepositoryBase<Student> student,
            ITokenServices jwtHelper,
            ITokenServices token,
            IHttpContextHelper httpContextHelper)
        {
            _User = user;
            _Role = role;
            _Semester = semester;
            _Student = student;
            _jwtHelper = jwtHelper;
            _Token = token;
            _HttpContextHelper = httpContextHelper;
            UserId = string.IsNullOrEmpty(_HttpContextHelper.GetItem("UserId")) ? -100 : Convert.ToInt64(_HttpContextHelper.GetItem("UserId"));
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

        public List<UserResponse> GetAllUsers(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _User.All();
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.Username.Contains(search));
            }
            totalRecords = query.Count(); // Đếm tổng số bản ghi

            if (pageNumber != -1 && pageSize != -1)
            {
                // Sắp xếp phân trang
                query = query.OrderBy(u => u.Id)
                             .Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize);
            }
            else
            {
                query = query.OrderBy(u => u.Id); // Sắp xếp nếu không phân trang
            }

            var users = query
                .Select(s => new UserResponse()
                {
                    Id = s.Id,
                    Username = s.Username,
                    IsLocked = s.IsLocked,
                    IsVerify = s.IsVerify,
                    RoleName = s.Role.DisplayName,
                    StudentName = s.Student != null ? (s.Student.LastName + " " + s.Student.FirstName) : null,
                    SemesterId = s.SemesterId   
                }).ToList();

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
                    StudentName = _Student.Find(f => f.Id == user.StudentId) != null ? _Student.Find(f => f.Id == user.StudentId).FirstName + " " + _Student.Find(f => f.Id == user.StudentId).LastName : null,
                    SemesterId = user.SemesterId
                };
                return userResponse;
            }
            return null;
        }
        public AuthToken GetProfile()
        {
            var token = _HttpContextHelper.GetHeader("Authorization")?.Replace("Bearer ", "");
            if(!string.IsNullOrEmpty(token))
            {
                var AuthToken = _Token.GetInfoFromToken(token);
                if(AuthToken != null)
                    return AuthToken;
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
                    StudentName = _Student.Find(f => f.Id == user.StudentId) != null ? _Student.Find(f => f.Id == user.StudentId).FirstName + " " + _Student.Find(f => f.Id == user.StudentId).LastName : null,
                    SemesterId = user.SemesterId
                };

                return userResponse;
            }
            return null;
        }

        public async Task<HttpResponse> SetSemesterUser(long IdSemester)
        {
            var User = _User.Find(f => f.Id == UserId);
            if (User == null)
                return HttpResponse.Error("Không tìm thấy user !!.");

            var Semester = _Semester.Find(f => f.Id ==  IdSemester);
            if (Semester == null)
                return HttpResponse.Error("Không tìm thấy học kì !!.");

            User.Semester = Semester;
            _User.Update(User);

            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: $"Chuyển sang học kỳ {Semester.YearStart}-{Semester.YearEnd} thành công !!.");
        }
    }
}
