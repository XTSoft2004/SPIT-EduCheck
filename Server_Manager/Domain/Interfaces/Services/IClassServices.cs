using Domain.Common.Http;
using Domain.Model.Request.Class;
using Domain.Model.Response.Class;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IClassServices
    {
        List<ClassResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords);
        List<ClassResponse> GetClassInSemester(string search, int pageNumber, int pageSize, out int totalRecords);
        Task<HttpResponse> CreateAsync(ClassRequest request);
        Task<HttpResponse> UpdateAsync(ClassRequest request);
        Task<HttpResponse> DeleteAsync(long Id);

        Task<HttpResponse> AddNotificationStudent(long ClassId, long StudentId);
    }
}
