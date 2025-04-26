using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;

namespace Domain.Interfaces.Services
{
    public interface IGoogleDriverServices
    {
        Task<string> UploadImage(UploadFileRequest uploadFileRequest);
        Task<string> GetAccessToken();
        Task<string> PreviewFile(string fileId);
    }
}
