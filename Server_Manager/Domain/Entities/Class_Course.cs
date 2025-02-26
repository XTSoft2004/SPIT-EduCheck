using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    /// <summary>
    /// Liên kết học phần và lớp học
    /// </summary>
    public class Class_Course : EntityBase
    {
        public long ClassId { get; set; }
        public virtual Class Class { get; set; }

        public long CourseId { get; set; }
        public virtual Course Course { get; set; }

    }
}
