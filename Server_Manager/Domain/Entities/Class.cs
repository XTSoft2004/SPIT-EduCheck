using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Class : EntityBase
    {
        [StringLength(100), Required]
        public string Code { get; set; }
        [StringLength(255), Required]
        public string Name { get; set; }
        [Required]
        public int Day { get; set; }
        [Required]
        public TimeOnly TimeStart { get; set; }
        [Required]
        public TimeOnly TimeEnd { get; set; }

        public long? LecturerId { get; set; }
        [ForeignKey(nameof(LecturerId))]
        public virtual Lecturer? Lecturer { get; set; }
        public long? CourseId { get; set; }
        [ForeignKey(nameof(CourseId))]
        public virtual Course? Course { get; set; }
        public ICollection<Class_Student> ClassStudents { get; set; } = new List<Class_Student>();
        public virtual ICollection<Timesheet> Timesheets { get; set; }
    }
}
