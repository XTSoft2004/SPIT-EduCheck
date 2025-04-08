using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Student;
using Domain.Model.Response.Auth;
using Domain.Model.Response.Student;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class StudentServices : BaseService, IStudentServices
    {
        private readonly IRepositoryBase<Student> _Student;
        private readonly IRepositoryBase<User> _User;
        private readonly ITokenServices _TokenServices;
        private readonly IHttpContextHelper _HttpContextHelper;
        private AuthToken? _AuthToken;
        public StudentServices(IRepositoryBase<Student> student, IRepositoryBase<User> user, ITokenServices tokenServices, IHttpContextHelper httpContextHelper)
        {
            _Student = student;
            _User = user;
            _TokenServices = tokenServices;
            _HttpContextHelper = httpContextHelper;
            var authHeader = _HttpContextHelper.GetHeader("Authorization");
            _AuthToken = !string.IsNullOrEmpty(authHeader) ? _TokenServices.GetInfoFromToken(authHeader) : null;
        }

        public async Task<HttpResponse> CreateAsync(StudentRequest studentRequest)
        {
            if (studentRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(x => x.MaSinhVien == studentRequest.MaSinhVien.Trim());
            if (_student != null)
                return HttpResponse.Error("Mã sinh viên đã tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var student = new Student()
            {
                MaSinhVien = studentRequest.MaSinhVien.Trim(),
                FirstName = studentRequest.FirstName.Trim(),
                LastName = studentRequest.LastName.Trim(),
                Class = studentRequest.Class.Trim(),
                PhoneNumber = studentRequest.PhoneNumber.Trim(),
                Email = studentRequest.Email.Trim(),
                Gender = studentRequest.Gender,
                Dob = studentRequest.Dob,
                UserId = null, // Được phép null
                CreatedDate = DateTime.Now,
                CreatedBy = _AuthToken?.Username,
            };

            _Student.Insert(student);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Tạo sinh viên thành công.");
        }
        public async Task<HttpResponse> UpdateAsync(StudentRequest studentRequest)
        {
            if (studentRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var student = _Student.Find(x => x.Id == studentRequest.Id);
            if (student == null)
                return HttpResponse.Error("Sinh viên không tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else if (_Student.Find(f => f.MaSinhVien == studentRequest.MaSinhVien.Trim() && f.Id != studentRequest.Id) != null)
                return HttpResponse.Error("Mã sinh viên đã có người đặt, vui lòng kiểm tra lại", System.Net.HttpStatusCode.BadRequest);
            else
            {
                student.MaSinhVien = studentRequest.MaSinhVien.Trim();
                student.FirstName = studentRequest.FirstName.Trim();
                student.LastName = studentRequest.LastName.Trim();
                student.Class = studentRequest.Class.Trim();
                student.PhoneNumber = studentRequest.PhoneNumber.Trim();
                student.Email = studentRequest.Email.Trim();
                student.Gender = studentRequest.Gender;
                student.Dob = studentRequest.Dob;

                student.ModifiedBy = _AuthToken?.Username;
                student.ModifiedDate = DateTime.Now;
                _Student.Update(student);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật sinh viên thành công.");
            }
        }

        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var student = _Student.Find(x => x.Id == Id);
            if (student == null)
                return HttpResponse.Error("Sinh viên không tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                _Student.Delete(student);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa sinh viên thành công.");
            }
        }

        public List<StudentResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Student.All();

            // Chuyển đổi `search` về lowercase để tránh gọi `ToLower()` nhiều lần trong truy vấn
            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(s =>
                    s.MaSinhVien.Contains(searchLower) ||
                    s.FirstName.Contains(searchLower) ||
                    s.LastName.Contains(searchLower) ||
                    s.Email.Contains(searchLower) ||
                    s.Class.Contains(searchLower) ||
                    s.PhoneNumber.Contains(searchLower) ||
                    s.Dob.ToString()!.Contains(searchLower) ||
                    (s.Gender == true ? "nam" : "nữ").Contains(searchLower));
            }

            // Đếm tổng số bản ghi trước khi áp dụng phân trang
            totalRecords = query.Count();

            // Sắp xếp theo ID tăng dần
            query = query.OrderBy(s => s.Id);

            // Áp dụng phân trang nếu có
            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Lấy dữ liệu cần thiết và chuyển sang danh sách
            return query.Select(s => new StudentResponse
            {
                Id = s.Id,
                MaSinhVien = s.MaSinhVien,
                FirstName = s.FirstName,
                LastName = s.LastName,
                Class = s.Class,
                PhoneNumber = s.PhoneNumber,
                Email = s.Email,
                Dob = s.Dob,
                Gender = s.Gender,
                UserName = _User.All().Where(u => u.StudentId == s.Id).Select(u => u.Username).FirstOrDefault(),
            }).ToList();
        }
        public async Task<HttpResponse> AddStudentInUser(long IdUser, long IdStudent)
        {
            var student = _Student.Find(x => x.Id == IdStudent);
            if (student == null)
                return HttpResponse.Error("Sinh viên không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var user = _User.Find(x => x.Id == IdUser);
            if (user == null)
                return HttpResponse.Error("Tài khoản không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var existingUser = _User.Find(x => x.StudentId == IdStudent);
            if (existingUser != null)
            {
                return HttpResponse.Error("Sinh viên này đã được gán cho tài khoản khác.", System.Net.HttpStatusCode.Conflict);
            }

            user.StudentId = IdStudent;
            student.UserId = IdUser;
            _User.Update(user);
            _Student.Update(student);
            
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Thêm sinh viên vào user thành công.");
        }

        public async Task<HttpResponse> RemoveStudentInUser(long IdUser)
        {
            var user = _User.Find(x => x.Id == IdUser);
            if (user == null)
                return HttpResponse.Error("Tài khoản không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            user.StudentId = null;
            _User.Update(user);

            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Xóa sinh viên khỏi user thành công.");
        }

    }
}
