using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    /// <summary>
    /// Sinh viên chấm công
    /// </summary>
    public class TeachingSchedule : EntityBase
    {
        /// <summary>
        /// Đường dẫn minh chứng chấm công
        /// </summary>
        public string PathImage { get; set; }
        /// <summary>
        /// Tình trạng duyệt (Đã duyệt, Chưa duyệt, Đang duyệt)
        /// </summary>
        public string TinhTrang { get; set; }
        /// <summary>
        /// Thời gian chấm công
        /// </summary>
        public DateTime Date { get; set; }
        /// <summary>
        /// Thời gian sinh viên tới lớp
        /// </summary>
        public DateTime CheckIn { get; set; }
        /// <summary>
        /// Thời gian sinh viên rời lớp
        /// </summary>
        public DateTime CheckOut { get; set; }

        public long StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public virtual Student Students { get; set; }

        public long Class_CoursesId { get; set; }
        [ForeignKey(nameof(Class_CoursesId))]
        public virtual Class_Courses Class_Courses { get; set; }

    }
}
