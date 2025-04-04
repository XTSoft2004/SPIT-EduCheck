using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Extension
{
    public class ClassImport
    {
        public string classId { get; set; }
        public string className { get; set; }
        public string teacher { get; set; }
        public int day { get; set; }
        public string timeStart { get; set; }
        public string timeEnd { get; set; }
    }

    public class CourseImport
    {
        public string courseId { get; set; }
        public string courseName { get; set; }
        public int credits { get; set; }
        public List<ClassImport> @class { get; set; }
    }
    public class ClassImportRequest
    {
        public IFormFile FileUpload { get; set; }
    }
}
