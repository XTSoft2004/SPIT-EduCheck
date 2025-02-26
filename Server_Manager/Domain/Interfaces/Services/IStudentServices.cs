using Domain.Common.Http;
using Domain.Model.Request.Student;
using Domain.Model.Response.Student;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IStudentServices
    {
        /// <summary>
        /// Lấy tất cả các sinh viên
        /// </summary>
        /// <returns></returns>
        List<StudentResponse> GetAll();
        /// <summary>
        /// Tạo sinh viên
        /// </summary>
        /// <param name="studentRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(StudentRequest studentRequest);
        /// <summary>
        /// Cập nhật thông tin sinh viên
        /// </summary>
        /// <param name="studentRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(StudentRequest studentRequest);
        /// <summary>
        /// Xóa sinh viên
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long Id);
        /// <summary>
        /// Thêm sinh viên vào user
        /// </summary>
        /// <param name="IdUser"></param>
        /// <param name="IdStudent"></param>
        /// <returns></returns>
        Task<HttpResponse> AddStudentInUser(long IdUser, long IdStudent);
        /// <summary>
        /// Xóa sinh viên khỏi user
        /// </summary>
        /// <param name="IdUser"></param>
        /// <param name="IdStudent"></param>
        /// <returns></returns>
        Task<HttpResponse> RemoveStudentInUser(long IdUser);
    }
}
