using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Class_Timesheet : EntityBase
    {
        public long ClassId { get; set; }
        public virtual Class Class { get; set; }

        
        public long TimesheetId { get; set; }
        public virtual Timesheet Timesheet { get; set; }
    }
}
