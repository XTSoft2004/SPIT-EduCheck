using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Lecturer
{
    public class LecturerRequest
    {
        public long Id { get; set; }
        [StringLength(255), Required]
        public string FullName { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(10)]
        public string PhoneNumber { get; set; }
    }
}
