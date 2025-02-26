using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Class_Student : EntityBase
    {
        public long StudentId { get; set; }
        public virtual Student Student { get; set; }


        public long ClassId { get; set; }   
        public virtual Class Class { get; set; }
    }
}
