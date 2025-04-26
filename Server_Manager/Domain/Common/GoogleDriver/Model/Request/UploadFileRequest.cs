using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Request
{
    public class UploadFileRequest
    {
        public string FileName { get; set; } = string.Empty;
        public byte[] imageBytes { get; set; }
        //public IFormFile? fileUpload { get; set; }
    }
}
