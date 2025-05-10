using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class ChangeInfoRequest
    {
        public string FirstName { get; set; }
        [StringLength(250), Required]
        public string LastName { get; set; }
        [StringLength(10)]
        public string Class { get; set; }
        [StringLength(10)]
        public string PhoneNumber { get; set; }
        [StringLength(100), Required]
        public string Email { get; set; }
        [Required]
        public bool? Gender { get; set; }
        [Required]
        public DateOnly? Dob { get; set; }
    }
}
