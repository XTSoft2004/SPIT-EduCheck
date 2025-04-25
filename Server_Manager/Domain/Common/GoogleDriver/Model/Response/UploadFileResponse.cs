using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class UploadFileResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string MimeType { get; set; }
    }
}
