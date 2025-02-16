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
        UserResponse GetMe();
        /// <summary>
        /// Lấy tất cả user
        /// </summary>
        /// <returns></returns>
        List<UserResponse> GetAllUsers();
        /// <summary>
        /// Lấy user theo Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        UserResponse GetUserById(long Id);
        /// <summary>
        /// Tạo tài khoản
        /// </summary>
        /// <param name="registerRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> ChangePassword(ChangePwRequest changePwRequest);
        /// <summary>
        /// Xóa tài khoản
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long Id);

        Task<HttpResponse> RefreshToken(string refreshToken);
    }
}
