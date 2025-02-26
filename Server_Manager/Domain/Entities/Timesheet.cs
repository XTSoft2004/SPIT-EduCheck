using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Timesheet : EntityBase
    {
        public string Image_Check { get; set; }
        public string Status { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public ICollection<Class_Timesheet> ClassTimesheets { get; set; } = new List<Class_Timesheet>();
    }
}
