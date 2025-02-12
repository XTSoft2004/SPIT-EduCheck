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
    /// Sinh viên
    /// </summary>
    public class Student : EntityBase
    {
        /// <summary>
        /// Mã sinh viên
        /// </summary>
        [StringLength(10), Required]
        public string MaSinhVien { get; set; }
        /// <summary>
        /// Họ
        /// </summary>
        [StringLength(250), Required]
        public string FirstName { get; set; }
        /// <summary>
        /// Tên
        /// </summary>
        [StringLength(250), Required]
        public string LastName { get; set; }
        /// <summary>
        /// Lớp
        /// </summary>
        [StringLength(10), Required]
        public string Class { get; set; }

        /// <summary>
        /// Số điện thoại sinh viên
        /// </summary>
        [StringLength(10)]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Email sinh viên
        /// </summary>
        [StringLength(100)]
        public string Email { get; set; }

        public ICollection<TeachingSchedule> TeachingSchedules { get; set; } = new List<TeachingSchedule>();    
    }
}
