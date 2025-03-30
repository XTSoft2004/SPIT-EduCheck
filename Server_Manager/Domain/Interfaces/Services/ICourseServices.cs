using Domain.Common.Http;
using Domain.Entities;
using Domain.Model.Request.Course;
using Domain.Model.Response.Course;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ICourseServices
    {
        List<CourseResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords);
        Task<HttpResponse> CreateAsync(CourseRequest courseRequest);
        Task<HttpResponse> UpdateAsync(CourseRequest courseRequest);
        Task<HttpResponse> DeleteAsync(long Id);
        Task<HttpResponse> Remove_Semester_To_Course(long CourseId);
    }
}
