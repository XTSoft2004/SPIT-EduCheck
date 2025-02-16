using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Base;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : EntityBase
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
        public bool IsLocked { get; set; } = false;
        /// <summary>
        /// Tài khoản xác minh
        /// </summary>
        public bool IsVerify { get; set; } = false;

        public long RoleId { get; set; }
        [ForeignKey(nameof(RoleId))]
        public virtual Role Role { get; set; }

        public long StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public virtual Student Student { get; set; }
        public virtual RefreshToken RefreshToken { get; set; }
    }
}
