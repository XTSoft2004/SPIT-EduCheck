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
    /// Học kỳ
    /// </summary>
    public class Semester : EntityBase
    {
        /// <summary>
        /// Học kỳ
        /// </summary>
        [Required]
        public int Semesters_Number { get; set; }
        /// <summary>
        /// Năm học kỳ
        /// </summary>
        [Required]
        public int Year { get; set; }
        /// <summary>
        /// Danh sách các học phần trong học kỳ
        /// </summary>
        public virtual ICollection<Course> Courses { get; set; }
    }
}
