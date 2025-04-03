using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Extension
{
    public class ClassImport
    {
        public string courseId { get; set; }
        public string courseName { get; set; }
        public string credits { get; set; }
        public string teacher { get; set; }
        public int day { get; set; }
        public string timeStart { get; set; }
        public string timeEnd { get; set; }
    }

    public class CourseImport
    {
        public string courseName { get; set; }
        public List<ClassImport> @class { get; set; }
    }
}
