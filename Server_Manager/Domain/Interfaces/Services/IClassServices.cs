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
        List<ClassResponse> GetAll(int pageNumber, int pageSize, out int totalRecords);
        Task<HttpResponse> CreateAsync(ClassRequest request);
        Task<HttpResponse> UpdateAsync(ClassRequest request);
        Task<HttpResponse> DeleteAsync(long Id);
        //Task<HttpResponse> Add_Lecturer_To_Class(long ClassId, long LecturerId);
        Task<HttpResponse> Remove_Lecturer_To_Class(long ClassId);
    }
}
