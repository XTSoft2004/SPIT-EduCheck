using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistic
{
    public class StatisticClassSalary
    {
        public double ToltalSalary { get; set; }

        public List<SalaryInfoStudent> SalaryInfoStudents { get; set; } = new List<SalaryInfoStudent>();    
    }
    public class SalaryInfoStudent
    {
        public string CodeName { get; set; }
        public string StudentName { get; set; }
        public int Day { get; set; } = 0;
        public double Salary { get; set; } = 0;
    }
}
