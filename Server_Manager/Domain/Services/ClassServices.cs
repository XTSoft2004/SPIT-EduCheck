using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Class;
using Domain.Model.Response.Class;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class ClassServices : BaseService, IClassServices
    {
        private readonly IRepositoryBase<Class> _Class;
        private readonly IRepositoryBase<Lecturer> _Lecturer;
        private readonly IRepositoryBase<Course> _Course;
        private readonly IRepositoryBase<Class_Student> _Class_Student;
        private readonly IRepositoryBase<Student> _Student;

        public ClassServices(IRepositoryBase<Class> @class, IRepositoryBase<Lecturer> lecturer, IRepositoryBase<Course> course, IRepositoryBase<Class_Student> class_Student, IRepositoryBase<Student> student)
        {
            _Class = @class;
            _Lecturer = lecturer;
            _Course = course;
            _Class_Student = class_Student;
            _Student = student;
        }

        public async Task<HttpResponse> CreateAsync(ClassRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _course = _Course.Find(f => f.Id == request.CourseId);
            if (_course == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);

            var _lecturer = _Lecturer.Find(f => f.Id == request.LecturerId);
            if (_lecturer == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);

            var _class = _Class.Find(_Class => _Class.Code == request.Code);
            if (_class != null)
                return HttpResponse.Error("Mã lớp đã tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var Class = new Class()
            {
                Code = request.Code,
                Name = request.Name,
                Day = request.Day,
                TimeStart = request.TimeStart,
                TimeEnd = request.TimeEnd,
                CreatedDate = DateTime.Now,
                LecturerId = request.LecturerId,
                CourseId = request.CourseId,
            };

            _Class.Insert(Class);
            await UnitOfWork.CommitAsync();

            var Class_New = _Class.Find(f => f.Code == request.Code);
            foreach (var studentid in request.StudentsId)
            {
                var student = _Student.Find(f => f.Id == studentid);
                if (student != null)
                {
                    _Class_Student.Insert(new Class_Student()
                    {
                        ClassId = Class_New.Id,
                        StudentId = studentid,
                        CreatedDate = DateTime.Now
                    });
                }
            }
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo lớp học thành công.");
        }

        public async Task<HttpResponse> UpdateAsync(ClassRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _class = _Class.Find(f => f.Id == request.Id);
            if (_class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);
            else if (_Class.Find(f => f.Code == request.Code && f.Id != request.Id) != null)
                return HttpResponse.Error("Mã lớp học đã được đặt, vui lòng kiểm tra lại", System.Net.HttpStatusCode.BadRequest);
            else if (_Lecturer.Find(f => f.Id == request.LecturerId) == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);
            else if (_Course.Find(f => f.Id == request.CourseId) == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _class.Code = request.Code;
                _class.Name = request.Name;
                _class.Day = request.Day;
                _class.TimeStart = request.TimeStart;
                _class.TimeEnd = request.TimeEnd;
                _class.LecturerId = request.LecturerId;
                _class.CourseId = request.CourseId;

                var class_students = _Class_Student.ListBy(f => f.ClassId == request.Id);
                var StudentNotClass = class_students.Where(f => !request.StudentsId.Contains(f.StudentId)).ToList();
                _Class_Student.DeleteRange(StudentNotClass); // Xóa tất cả sinh viên không thuộc lớp học

                var studentId_Insert = request.StudentsId.Where(f => !class_students.Select(s => s.StudentId).Contains(f)).ToList();
                _Class_Student.InsertRange(studentId_Insert.Select(s => new Class_Student()
                {
                    ClassId = request.Id,
                    StudentId = s,
                    CreatedDate = DateTime.Now,
                }));

                _class.ModifiedDate = DateTime.Now;
                _Class.Update(_class);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật lớp học thành công.");
            }
        }

        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var _class = _Class.Find(f => f.Id == Id);
            if (_class == null) return
                    HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _Class.Delete(_class);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa lớp học thành công.");
            }
        }

        public List<ClassResponse> GetAll(int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Class.All();
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

            var classes = query
                .AsEnumerable() // Chuyển sang truy vấn trên bộ nhớ
                .Select(s => new ClassResponse()
                {
                    Id = s.Id,
                    Code = s.Code,
                    Name = s.Name,
                    TimeStart = s.TimeStart,
                    TimeEnd = s.TimeEnd,
                    LecturerId = s.LecturerId,
                    CourseId = s.CourseId,
                    StudentsId = _Class_Student.ListBy(f => f.ClassId == s.Id)
                                               .Select(s => s.StudentId)
                                               .ToList() // Thực hiện trên bộ nhớ thay vì trong SQL
                }).ToList();


            return classes;
        }

        public async Task<HttpResponse> Remove_Lecturer_To_Class(long ClassId)
        {
            var _class = _Class.Find(f => f.Id == ClassId);
            if (_class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);

            _class.LecturerId = null;
            _Class.Update(_class);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Xóa giảng viên khỏi lớp học thành công.");
        }
    }
}


