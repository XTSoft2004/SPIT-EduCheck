using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Extension
{
    public class UploadFileRequest
    {
        public IFormFile FileUpload { get; set; }
    }
}
