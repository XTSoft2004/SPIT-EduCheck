using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistic
{
    public class StatisticStudentTimesheet
    {
        public int NumberStudent { get; set; }
        public int NumberTimesheet { get; set; }    
        public string TopTimesheetStudentName { get; set; }
        public int NumberTimesheetDay { get; set; }
    }
}
