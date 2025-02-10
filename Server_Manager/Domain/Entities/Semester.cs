using Domain.Entities.Base;
using System;
using System.Collections.Generic;
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
        public int Semesters_Number { get; set; }
        /// <summary>
        /// Năm học
        /// </summary>
        public int Year { get; set; }

        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }
}
