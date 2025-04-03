using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Lecturer_Class : EntityBase
    {
        public long? LecturerId { get; set; }
        public virtual Lecturer Lecturer { get; set; }

        public long? ClassId { get; set; }
        public virtual Class Class { get; set; }
    }
}
