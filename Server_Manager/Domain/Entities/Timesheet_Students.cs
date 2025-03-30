using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Timesheet_Students
    {
        public long TimesheetId { get; set; }
        public virtual Timesheet Timesheet { get; set; }

        public long StudentId { get; set; }
        public virtual Student Student { get; set; }
    }
}
