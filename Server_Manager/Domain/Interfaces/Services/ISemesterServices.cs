using Domain.Common.Http;
using Domain.Model.Request.Semester;
using Domain.Model.Response.Semester;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ISemesterServices
    {
        List<SemesterResponse> GetAll(int pageNumber, int pageSize, out int totalRecords);

        Task<HttpResponse> CreateAsync(SemesterRequest request);
        Task<HttpResponse> UpdateAsync(SemesterRequest request);
        Task<HttpResponse> DeleteAsync(long Id);
    }
}
