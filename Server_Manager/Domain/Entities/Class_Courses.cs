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
    /// <summary>
    /// Lớp Học Phần
    /// </summary>
    public class Class_Courses : EntityBase
    {
        /// <summary>
        /// Mã lớp học phần
        /// </summary>
        [StringLength(50), Required]
        public string Code { get; set; }
        /// <summary>
        /// Tên lớp học phần
        /// </summary>
        [StringLength(250), Required]
        public string Name { get; set; }
        /// <summary>
        /// Thời gian học
        /// </summary>
        public DateTime DateTime { get; set; }

        public long CourseID { get; set; }
        [ForeignKey(nameof(CourseID))]
        public virtual Course Courses { get; set; }
        public long LecturerID { get; set; }
        [ForeignKey(nameof(CourseID))]    
        public virtual Lecturer Lecturers { get; set; }

        public ICollection<TeachingSchedule> TeachingSchedules { get; set; } = new List<TeachingSchedule>();

    }
}
