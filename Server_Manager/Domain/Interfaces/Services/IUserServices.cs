using Domain.Common.Http;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IUserServices
    {
        /// <summary>
        /// Lấy thông tin của cá nhân
        /// </summary>
        /// <returns></returns>
        UserResponse GetMe();
        /// <summary>
        /// Lấy tất cả người dùng
        /// </summary>
        /// <returns></returns>
        List<UserResponse> GetAllUsers(string search, int pageNumber, int pageSize, out int totalRecords);
        /// <summary>
        /// Lấy người dùng theo Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        UserResponse GetUserById(long Id);
        /// <summary>
        /// Thay đổi mật khẩu của người dùng
        /// </summary>
        /// <param name="changePwRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> ChangePassword(ChangePwRequest changePwRequest);
        /// <summary>
        /// Xóa người dùng
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long Id);
        Task<HttpResponse> SetSemesterUser(long IdSemester);
    }
}
