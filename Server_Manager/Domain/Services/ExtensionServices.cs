using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Class;
using Domain.Model.Request.Course;
using Domain.Model.Request.Extension;
using Domain.Model.Request.Semester;
using Domain.Model.Request.Timesheet;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;

namespace Domain.Services
{
    public class ExtensionServices : BaseService, IExtensionServices
    {
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Student> _Student;
        private readonly IRepositoryBase<Semester> _Semester;
        private readonly IRepositoryBase<Course> _Course;
        private readonly IRepositoryBase<Class> _Class;
        private readonly IRepositoryBase<Lecturer> _Lecturer;
        private readonly IRepositoryBase<Lecturer_Class> _LectureClass;

        public ExtensionServices(IRepositoryBase<User> user, IRepositoryBase<Student> student, IRepositoryBase<Semester> semester, IRepositoryBase<Course> course, IRepositoryBase<Class> @class, IRepositoryBase<Lecturer> lecturer, IRepositoryBase<Lecturer_Class> lectureClass)
        {
            _User = user;
            _Student = student;
            _Semester = semester;
            _Course = course;
            _Class = @class;
            _Lecturer = lecturer;
            _LectureClass = lectureClass;
        }

        public async Task<HttpResponse> CreateAccountByStudentId(List<string> studentsMSV)
        {
            if (studentsMSV == null || studentsMSV.Count == 0)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);
            var _userAll = _User.All();
            int success = 0;
            foreach (var studentMSV in studentsMSV)
            {
                var _user = _userAll.Where(f => f.Username == studentMSV).FirstOrDefault();
                if (_user != null)
                    continue;
                User user = new User()
                {
                    Username = studentMSV,
                    Password = "123456",
                    RoleId = -2,
                    CreatedDate = DateTime.Now,
                    Semester = GetSemesterNow(),
                };
                _User.Insert(user);
                success++;
            }
            await UnitOfWork.CommitAsync();

            foreach (var studentMSV in studentsMSV)
            {
                var _user = _userAll.Where(f => f.Username == studentMSV).FirstOrDefault();
                if (_user == null)
                    continue;
                var student = _Student.Find(f => f.MaSinhVien == studentMSV);
                if (student != null)
                {
                    student.User = _user;
                    _Student.Update(student);
                }
            }
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: $"Tạo tài khoản {success} tài khoản thành công.");
        }
        private Semester GetSemesterNow()
        {
            int yearNow = DateTime.Now.Year;
            int monthNow = DateTime.Now.Month;
            int semesterNow;
            int yearStart, yearEnd;

            if (monthNow >= 9 && monthNow <= 12)
            {
                semesterNow = 1;
                yearStart = yearNow;
                yearEnd = yearNow + 1;
            }
            else if (monthNow >= 1 && monthNow <= 5)
            {
                semesterNow = 2;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }
            else // Từ tháng 6 đến đầu tháng 9
            {
                semesterNow = 3;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }

            var semester = _Semester.Find(f => f.YearStart == yearStart
                && f.YearEnd == yearEnd
                && f.Semesters_Number == semesterNow);

            return semester;
        }
        public async Task<HttpResponse> ImportClass(string pathFile)
        {
            if (string.IsNullOrEmpty(pathFile))
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var readFile = File.ReadAllText(pathFile);
            CourseImport Course = JsonConvert.DeserializeObject<CourseImport>(readFile);

            var ClassStr = Course.@class?.FirstOrDefault()?.classId;

            var match = Regex.Match(ClassStr, @"(\d{4})-(\d{4})\.(\d+)");
            var SemesterImport = new SemesterRequest()
            {
                YearStart = Convert.ToInt32(match.Groups[1].Value),
                YearEnd = Convert.ToInt32(match.Groups[2].Value),
                Semesters_Number = Convert.ToInt32(match.Groups[3].Value)
            };


            var semester = _Semester.Find(f => f.YearStart == SemesterImport.YearStart
                && f.YearEnd == SemesterImport.YearEnd
                && f.Semesters_Number == SemesterImport.Semesters_Number);
            if(semester == null)
            {
                semester = new Semester()
                {
                    YearStart = SemesterImport.YearStart,
                    YearEnd = SemesterImport.YearEnd,
                    Semesters_Number = SemesterImport.Semesters_Number
                };
                _Semester.Insert(semester);
                await UnitOfWork.CommitAsync();
            }

            var course = _Course.Find(f => f.Code == Course.courseId && f.SemesterId == semester.Id);
            if(course == null)
            {
                course = new Course()
                {
                    Code = Course.courseId,
                    Name = Course.courseName,
                    Credits = Course.credits,
                    Semester = semester,
                };
                _Course.Insert(course);
                await UnitOfWork.CommitAsync();
            }

            foreach (var item in Course.@class)
            {
                var classImport = _Class.Find(f => f.Code == item.classId && f.CourseId == course.Id);
                if (classImport == null)
                {
                    classImport = new Class()
                    {
                        Code = item.classId,
                        Name = item.className,
                        Day = item.day,
                        TimeStart = TimeOnly.Parse(item.timeStart),
                        TimeEnd = TimeOnly.Parse(item.timeEnd),
                        CreatedDate = DateTime.Now,
                        Course = course,
                    };
                    _Class.Insert(classImport);
                    await UnitOfWork.CommitAsync();
                }

                var lecturer = _Lecturer.Find(f => f.FullName == item.teacher);
                if(lecturer == null)
                {
                    lecturer = new Lecturer()
                    {
                        FullName = item.teacher,
                        CreatedDate = DateTime.Now
                    };
                    _Lecturer.Insert(lecturer);
                    await UnitOfWork.CommitAsync();
                }

                var lecturerClass = _LectureClass.Find(f => f.ClassId == classImport.Id && f.LecturerId == lecturer.Id);
                if (lecturerClass == null)
                {
                    lecturerClass = new Lecturer_Class()
                    {
                        ClassId = classImport.Id,
                        LecturerId = lecturer.Id
                    };
                    _LectureClass.Insert(lecturerClass);
                    await UnitOfWork.CommitAsync();
                }
            }

            return HttpResponse.OK(message: "Import lớp học thành công.");
        }

        public Task<HttpResponse> ImportStudents()
        {
            throw new NotImplementedException();
        }

        public async Task<HttpResponse> UploadFile(string uploadsFolder, UploadFileRequest uploadFileRequest)
        {
            if (uploadFileRequest.FileUpload == null || uploadFileRequest.FileUpload.Length == 0)
                return HttpResponse.Error("File không hợp lệ !!", System.Net.HttpStatusCode.BadRequest);

            // Lấy đường dẫn thư mục lưu file
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file duy nhất
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadFileRequest.FileUpload.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Lưu file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await uploadFileRequest.FileUpload.CopyToAsync(fileStream);
            }

            return HttpResponse.OK(message: "Tải file lên thành công.", data: new { FilePath = filePath });
        }
    }
}
