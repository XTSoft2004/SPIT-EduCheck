using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Lecturer : EntityBase
    {
        [StringLength(255), Required]
        public string FullName { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(10)]
        public string PhoneNumber { get; set; }

        public ICollection<Class> Class { get; set; }
    }
}
