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
    /// Giảng viên
    /// </summary>
    public class Lecturer : EntityBase
    {
        /// <summary>
        /// Họ và tên giảng viên
        /// </summary>
        [StringLength(250), Required]
        public string FullName { get; set; }
        /// <summary>
        /// Số điện thoại giảng viên
        /// </summary>
        [StringLength(10), Required]
        public string PhoneNumber { get; set; }
        /// <summary>
        /// Email giảng viên
        /// </summary>
        [StringLength(100), Required]
        public string Email { get; set; }

        public ICollection<Class_Courses> Class_Courses { get; set; } = new List<Class_Courses>();
    }
}
