using Domain.Entities.Base;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Role : EntityBase
    {
        /// <summary>
        /// Tên hiển thị
        /// </summary>
        [Required, StringLength(200)]
        public string? DisplayName { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();    
    }
}
