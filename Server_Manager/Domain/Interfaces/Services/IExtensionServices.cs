using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common.Http;
using Domain.Model.Request.Extension;

namespace Domain.Interfaces.Services
{
    public interface IExtensionServices
    {
        Task<HttpResponse> CreateAccountByStudentId(List<string> studentsMSV);
        Task<HttpResponse> ImportClass(string pathFile);
        Task<HttpResponse> ImportStudents();
        Task<HttpResponse> UploadFile(string uploadsFolder, UploadFileRequest uploadFileRequest);
    }
}
