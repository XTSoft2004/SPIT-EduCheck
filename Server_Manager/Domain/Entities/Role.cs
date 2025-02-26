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
    /// Chức danh
    /// </summary>
    public class Role : EntityBase
    {
        /// <summary>
        /// Tên chức danh
        /// </summary>
        [StringLength(255), Required]
        public string? DisplayName { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
    