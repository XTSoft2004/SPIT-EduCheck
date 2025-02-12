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
    /// Học phần
    /// </summary>
    public class Course : EntityBase
    {
        /// <summary>
        /// Mã học phần
        /// </summary>
        [StringLength(100), Required]
        public string Code { get; set; }
        /// <summary>
        /// Tên học phần
        /// </summary>
        [StringLength(250), Required]
        public string Name { get; set; }
        /// <summary>
        /// Số lượng tín chỉ
        /// </summary>
        public int Credits { get; set; }

        public long SemesterId { get; set; }
        [ForeignKey(nameof(SemesterId))]
        public virtual Semester Semester { get; set; }

        public ICollection<Class_Courses> ClassCourses { get; set; } = new List<Class_Courses>();
    }
}
