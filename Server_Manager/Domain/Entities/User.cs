using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User
    {
        /// <summary>
        /// Tên tài khoản
        /// </summary>
        [StringLength(50), Required]
        public string Username { get; set; }
        /// <summary>
        /// Mật khẩu tài khoản
        /// </summary>
        [StringLength(50), Required]
        public string Password { get; set; }
        /// <summary>
        /// Tài khoản bị khóa
        /// </summary>
        public bool IsLocked { get; set; }
        /// <summary>
        /// Giới tính
        /// </summary>
        public bool? Gender { get; set; }
        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? Dob { get; set; }

        public long RoleID { get; set; }
        [ForeignKey(nameof(RoleID))]
        public virtual Role Role { get; set; }
    }
}
