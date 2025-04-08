using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistic
{
    public class StatisticClass
    {
        public string ClassName { get; set; }
        public List<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
    }
    public class StudentClass
    {
        public string StudentName { get; set; }
        public int NumberTimesheet { get; set; }
    }
}
