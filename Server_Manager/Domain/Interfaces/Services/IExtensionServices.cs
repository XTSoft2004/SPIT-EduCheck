using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common.Http;

namespace Domain.Interfaces.Services
{
    public interface IExtensionServices
    {
        Task<HttpResponse> CreateAccountByStudentId(List<string> studentsMSV);
        Task<HttpResponse> ImportClass(string pathFile);
        Task<HttpResponse> ImportStudents();
    }
}
