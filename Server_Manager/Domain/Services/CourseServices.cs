using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Domain.Model.Response.Class;
using Domain.Model.Response.Course;
using Domain.Model.Response.Semester;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class CourseServices : BaseService, ICourseServices
    {
        private readonly IRepositoryBase<Course> _Course;
        private readonly IRepositoryBase<Semester> _Semester;
        private readonly IRepositoryBase<Class> _Class;

        public CourseServices(IRepositoryBase<Course> course, IRepositoryBase<Semester> semester, IRepositoryBase<Class> @class)
        {
            _Course = course;
            _Semester = semester;
            _Class = @class;
        }

        public async Task<HttpResponse> CreateAsync(CourseRequest courseRequest)
        {
            if (courseRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _semester = _Semester.Find(f => f.Id == courseRequest.SemesterId);
            if (_semester == null)
                return HttpResponse.Error("Không tìm thấy học kỳ.", System.Net.HttpStatusCode.NotFound);

            var _course = _Course.Find(f => f.Code == courseRequest.Code);
            if (_course != null)
                return HttpResponse.Error("Mã môn học đã tồn tại.", System.Net.HttpStatusCode.BadRequest);
            else
            {
                var Course = new Course()
                {
                    Code = courseRequest.Code,
                    Name = courseRequest.Name,
                    Credits = courseRequest.Credits,
                    CreatedDate = DateTime.Now,
                    SemesterId = courseRequest.SemesterId,
                };
                _Course.Insert(Course);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Tạo môn học thành công.");
            }
        }

        public async Task<HttpResponse> UpdateAsync(CourseRequest courseRequest)
        {
           if(courseRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _semester = _Semester.Find(f => f.Id == courseRequest.SemesterId);
            if (_semester == null)
                return HttpResponse.Error("Không tìm thấy học kỳ.", System.Net.HttpStatusCode.NotFound);

            var course = _Course.Find(f => f.Id == courseRequest.Id);
            if (course == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);
            else if (_Course.Find(f => f.Code == courseRequest.Code && f.Id != courseRequest.Id) != null)
                return HttpResponse.Error("Mã môn học đã được đặt, vui lòng kiểm tra lại", System.Net.HttpStatusCode.BadRequest);
            else
            {
                course.Code = courseRequest.Code;
                course.Name = courseRequest.Name;
                course.Credits = courseRequest.Credits;
                course.SemesterId = courseRequest.SemesterId;
                _Course.Update(course);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật môn học thành công.");
            }
        }
        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var course = _Course.Find(f => f.Id == Id);
            if(course == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _Course.Delete(course);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa môn học thành công.");
            }
        }

        public List<CourseResponse> GetAll(int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Course.All();
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

            var courses = query
                .Select(f => new CourseResponse()
                {
                    Id = f.Id,
                    Code = f.Code,
                    Name = f.Name,
                    Credits = f.Credits,
                    SemesterId = f.SemesterId
                    //Semester = f.SemesterId != null ? new SemesterResponse()
                    //{
                    //    Id = f.Semester.Id,
                    //    Semesters_Number = f.Semester.Semesters_Number,
                    //    Year = f.Semester.Year,
                    //} : null,
                    //Class = f.ClassCourses.Select(s => new ClassResponse()
                    //{
                    //    Id = s.Class.Id,
                    //    Code = s.Class.Code,
                    //    Name = s.Class.Name,
                    //    TimeStart = s.Class.TimeStart,
                    //    TimeEnd = s.Class.TimeEnd,
                    //}).ToList(),
                }).ToList();

            return courses;
        }

        public async Task<HttpResponse> Remove_Semester_To_Course(long CourseId)
        {
            var _course = _Course.Find(f => f.Id == CourseId);  
            if(_course == null)
                return HttpResponse.Error("Không tìm thấy môn học.", System.Net.HttpStatusCode.NotFound);

            _course.SemesterId = null;
            _Course.Update(_course);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Xóa học kỳ khỏi học kỳ thành công.");
        }
    }
}
