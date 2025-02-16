using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        [Display(Name = "Duy trì đăng nhập")]
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }

    }
}
