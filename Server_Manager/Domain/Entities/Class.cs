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
        public DateTime DateTime { get; set; }

        public long? LecturerId { get; set; }
        [ForeignKey(nameof(LecturerId))]
        public Lecturer? Lecturer { get; set; }

        public ICollection<Class_Course> ClassCourses { get; set; }
        public ICollection<Class_Student> ClassStudents { get; set; } = new List<Class_Student>();
        public ICollection<Class_Timesheet> ClassTimesheets { get; set; } = new List<Class_Timesheet>();
    }
}
