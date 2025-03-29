using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Student;
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

        public StudentServices(IRepositoryBase<Student> student, IRepositoryBase<User> user)
        {
            _Student = student;
            _User = user;
        }

        public async Task<HttpResponse> CreateAsync(StudentRequest studentRequest)
        {
            if (studentRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(x => x.MaSinhVien == studentRequest.MaSinhVien);
            if (_student != null)
                return HttpResponse.Error("Mã sinh viên đã tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var student = new Student() 
            {
                MaSinhVien = studentRequest.MaSinhVien,
                FirstName = studentRequest.FirstName,
                LastName = studentRequest.LastName,
                Class = studentRequest.Class,
                PhoneNumber = studentRequest.PhoneNumber,
                Email = studentRequest.Email,
                Gender = studentRequest.Gender,
                Dob = studentRequest.Dob,
                UserId = null, // Được phép null
                CreatedDate = DateTime.Now,
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
            if(student == null) 
                return HttpResponse.Error("Sinh viên không tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else if(_Student.Find(f => f.MaSinhVien == studentRequest.MaSinhVien && f.Id != studentRequest.Id) != null)
                return HttpResponse.Error("Mã sinh viên đã có người đặt, vui lòng kiểm tra lại", System.Net.HttpStatusCode.BadRequest);
            else
            {
                student.MaSinhVien = studentRequest.MaSinhVien;
                student.FirstName = studentRequest.FirstName;
                student.LastName = studentRequest.LastName;
                student.Class = studentRequest.Class;
                student.PhoneNumber = studentRequest.PhoneNumber;
                student.Email = studentRequest.Email;
                student.Gender = studentRequest.Gender;
                student.Dob = studentRequest.Dob;
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

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(s =>
                       s.MaSinhVien.ToLower().Contains(search) ||
                       s.FirstName.ToLower().Contains(search) ||
                       s.LastName.ToLower().Contains(search) ||
                       s.Email.ToLower().Contains(search) ||
                       s.Class.ToLower().Contains(search) ||
                       s.PhoneNumber.ToLower().Contains(search));
            }
            totalRecords = query.Count(); // Đếm tổng số bản ghi

            if (pageNumber != -1 && pageSize != -1)
            {
                // Sắp xếp phân trang
                query = query.OrderBy(u => u.Id)
                             .Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize);
            }

            query = query.OrderBy(u => u.Id); // Sắp xếp nếu không phân trang

            //if(totalRecords != query.Count())
            //    totalRecords = query.Count();

            var students = query
                .Select(s => new StudentResponse()
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
                    UserName = s.User.Username
                }).ToList();

            return students;
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
