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
    /// Sinh viên
    /// </summary>
    public class Student : EntityBase
    {
        /// <summary>
        /// Mã sinh viên
        /// </summary>
        [Required, StringLength(10)]
        public string MaSinhVien { get; set; }
        /// <summary>
        /// Họ sinh viên
        /// </summary>
        [Required, StringLength(100)]
        public string FirstName { get; set; }
        /// <summary>
        /// Tên sinh viên
        /// </summary>
        [Required, StringLength(100)]
        public string LastName { get; set; }
        /// <summary>
        /// Lớp sinh viên
        /// </summary>
        [Required, StringLength(10)]
        public string Class { get; set; }
        /// <summary>
        /// Số điện thoại
        /// </summary>
        [Required, StringLength(10)]
        public string PhoneNumber { get; set; }
        /// <summary>
        /// Email sinh viên
        /// </summary>
        [Required, StringLength(100)]
        public string Email { get; set; }
        /// <summary>
        /// Giới tính
        /// </summary>
        [Required]
        public bool? Gender { get; set; }
        /// <summary>
        /// Ngày sinh nhật
        /// </summary>
        [Required]
        public DateOnly? Dob { get; set; }

        public long? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
        public ICollection<Class_Student>? ClassStudents { get; set; } = new List<Class_Student>();
        public virtual ICollection<Timesheet> Timesheets { get; set; }
    }
}
