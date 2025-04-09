using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Class;
using Domain.Model.Response.Auth;
using Domain.Model.Response.Class;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Domain.Services
{
    public class ClassServices : BaseService, IClassServices
    {
        private readonly IRepositoryBase<Class> _Class;
        private readonly IRepositoryBase<Lecturer> _Lecturer;
        private readonly IRepositoryBase<Course> _Course;
        private readonly IRepositoryBase<Class_Student> _Class_Student;
        private readonly IRepositoryBase<Lecturer_Class> _Lecturer_Class;
        private readonly IRepositoryBase<Student> _Student;
        private readonly IRepositoryBase<User> _User;
        private readonly IHttpContextHelper _HttpContextHelper;
        private readonly ITokenServices _TokenServices;

        private AuthToken? _AuthToken;
        public ClassServices(IRepositoryBase<Class> @class, IRepositoryBase<Lecturer> lecturer, IRepositoryBase<Course> course, IRepositoryBase<Class_Student> class_Student, IRepositoryBase<Lecturer_Class> lecturer_Class, IRepositoryBase<Student> student, IRepositoryBase<User> user, IHttpContextHelper httpContextHelper, ITokenServices tokenServices)
        {
            _Class = @class;
            _Lecturer = lecturer;
            _Course = course;
            _Class_Student = class_Student;
            _Lecturer_Class = lecturer_Class;
            _Student = student;
            _User = user;
            _HttpContextHelper = httpContextHelper;
            _TokenServices = tokenServices;
            var authHeader = _HttpContextHelper.GetHeader("Authorization");
            _AuthToken = !string.IsNullOrEmpty(authHeader) ? _TokenServices.GetInfoFromToken(authHeader) : null;
        }

        public async Task<HttpResponse> CreateAsync(ClassRequest request)
        {
            if (request == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _course = _Course.Find(f => f.Id == request.CourseId);
            if (_course == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);

            var _lecturer = _Lecturer.Find(f => request.LecturersId.Contains(f.Id));
            if (_lecturer == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);

            var _student = _Student.Find(f => request.StudentsId.Contains(f.Id));
            if (_student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);


            var _class = _Class.Find(_Class => _Class.Code == request.Code);
            if (_class != null)
                return HttpResponse.Error("Mã lớp đã tồn tại, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            var Class = new Class()
            {
                Code = request.Code,
                Name = request.Name,
                Day = request.Day,
                TimeStart = request.TimeStart,
                TimeEnd = request.TimeEnd,
                CourseId = request.CourseId,
                CreatedBy = _AuthToken?.Username,
                CreatedDate = DateTime.Now,
            };

            _Class.Insert(Class);
            await UnitOfWork.CommitAsync();

            var Class_New = _Class.Find(f => f.Code == request.Code);

            foreach (var lerturerid in request.LecturersId)
            {
                var student = _Lecturer.Find(f => f.Id == lerturerid);
                if (student != null)
                {
                    _Lecturer_Class.Insert(new Lecturer_Class()
                    {
                        ClassId = Class_New.Id,
                        LecturerId = lerturerid,
                        CreatedDate = DateTime.Now
                    });
                }
            }

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
            else if (request.LecturersId.Count != 0 && _Lecturer.Find(f => request.LecturersId.Contains(f.Id)) == null)
                return HttpResponse.Error("Không tìm thấy giảng viên.", System.Net.HttpStatusCode.NotFound);
            else if (request.StudentsId.Count != 0 && _Student.Find(f => request.StudentsId.Contains(f.Id)) == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);
            else if (_Course.Find(f => f.Id == request.CourseId) == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _class.Code = request.Code;
                _class.Name = request.Name;
                _class.Day = request.Day;
                _class.TimeStart = request.TimeStart;
                _class.TimeEnd = request.TimeEnd;
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

                var class_lecturer = _Lecturer_Class.ListBy(f => f.ClassId == request.Id);
                var LecturerNotClass = class_lecturer.Where(f => !request.LecturersId.Contains(f.LecturerId)).ToList();
                _Lecturer_Class.DeleteRange(LecturerNotClass); // Xóa tất cả sinh viên không thuộc lớp học

                var lecturerId_Insert = request.LecturersId.Where(f => !class_lecturer.Select(s => s.LecturerId).Contains(f)).ToList();
                _Lecturer_Class.InsertRange(lecturerId_Insert.Select(s => new Lecturer_Class()
                {
                    ClassId = request.Id,
                    LecturerId = s,
                    CreatedDate = DateTime.Now,
                }));

                _class.ModifiedBy = _AuthToken?.Username;
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
        public List<ClassResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Class.All();
            if (!string.IsNullOrEmpty(search))
            {
                var LerturerName = _Lecturer.ListBy(f => f.FullName.ToLower().Contains(search.ToLower())).Select(s => s.Id).ToList();
                var StudentName = _Student.ListBy(f => ($"{f.LastName} {f.FirstName}").ToLower().Contains(search.ToLower())).Select(s => s.Id).ToList();
                query = query.Where(s =>
                       s.Code.ToLower().Contains(search) ||
                       s.Name.ToLower().Contains(search) ||
                       s.TimeStart.ToString().Contains(search) ||
                       s.TimeEnd.ToString().Contains(search) ||
                       s.CourseId.ToString().Contains(search) ||
                       s.LecturerClasses.Any(lc => LerturerName.Contains(lc.LecturerId)) ||
                       s.ClassStudents.Any(lc => StudentName.Contains(lc.StudentId)));
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

            var classes = query
                .AsEnumerable() // Chuyển sang truy vấn trên bộ nhớ
                .Select(s => new ClassResponse()
                {
                    Id = s.Id,
                    Code = s.Code,
                    Name = s.Name,
                    Day = s.Day,
                    TimeStart = s.TimeStart,
                    TimeEnd = s.TimeEnd,
                    LecturersId = _Lecturer_Class.ListBy(f => f.ClassId == s.Id)
                                               .Select(s => s.LecturerId)
                                               .ToList(), // Thực hiện trên bộ nhớ thay vì trong SQL
                    CourseId = s.CourseId,
                    StudentsId = _Class_Student.ListBy(f => f.ClassId == s.Id)
                                               .Select(s => s.StudentId)
                                               .ToList() // Thực hiện trên bộ nhớ thay vì trong SQL
                }).ToList();


            return classes;
        }
        // Lấy học kỳ mà user chọn để hiển thị các lớp trong năm đoá
        public List<ClassResponse> GetClassInSemester(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Class.All();
            if (!string.IsNullOrEmpty(search))
            {
                var LerturerName = _Lecturer.ListBy(f => f.FullName.ToLower().Contains(search.ToLower())).Select(s => s.Id).ToList();
                var StudentName = _Student.ListBy(f => (f.LastName + " " + f.FirstName).ToLower().Contains(search.ToLower())).Select(s => s.Id).ToList();
                query = query.Where(s =>
                       s.Code.ToLower().Contains(search) ||
                       s.Name.ToLower().Contains(search) ||
                       s.TimeStart.ToString().Contains(search) ||
                       ("thứ " + s.Day.ToString()).Contains(search) ||
                       s.TimeEnd.ToString().Contains(search) ||
                       s.CourseId.ToString().Contains(search) ||
                       s.LecturerClasses.Any(lc => LerturerName.Contains(lc.LecturerId)) ||
                       s.ClassStudents.Any(lc => StudentName.Contains(lc.StudentId)));
            }

            var c = _Course.ListBy(f => f.SemesterId == _AuthToken!.SemesterId).Select(s => s.Id).ToList();
            query = query.Where(w => c.Contains(w.CourseId.Value));

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

            return query.Select(s => new ClassResponse
                {
                    Id = s.Id,
                    Code = s.Code,
                    Name = s.Name,
                    Day = s.Day,
                    TimeStart = s.TimeStart,
                    TimeEnd = s.TimeEnd,
                    CourseId = s.CourseId,
                    LecturersId = s.LecturerClasses.Select(lc => lc.LecturerId).ToList(),
                    StudentsId = s.ClassStudents.Select(cs => cs.StudentId).ToList()
                }).ToList();
        }

        public async Task<HttpResponse> ImportClassByFile(string pathFile)
        {
            if (string.IsNullOrEmpty(pathFile))
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var readFile = File.ReadAllText(pathFile);
            var jsonData = JsonConvert.DeserializeObject<List<ClassRequest>>(readFile);

            // Đọc nội dung file và xử lý
            // ...
            return HttpResponse.OK(message: "Import lớp học thành công.");
        }
    }
}


