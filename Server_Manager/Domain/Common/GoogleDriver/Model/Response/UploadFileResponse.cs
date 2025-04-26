using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class UploadFileResponse
    {
        public string kind { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string mimeType { get; set; }
    }
}
