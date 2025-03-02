using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Time : EntityBase
    {
        public string Name { get; set; }
        public virtual ICollection<Timesheet> Timesheets { get; set; }
    }
}
