using Domain.Common.Http;
using Domain.Entities;
using Domain.Model.Request.Lecturer;
using Domain.Model.Response.Lecturer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ILecturerServices
    {
        List<LecturerResponse> GetAll(int pageNumber, int pageSize, out int totalRecords);

        Task<HttpResponse> CreateAsync(LecturerRequest lecturerRequest);
        Task<HttpResponse> UpdateAsync(LecturerRequest lecturerRequest);
        Task<HttpResponse> DeleteAsync(long Id);
    }
}
