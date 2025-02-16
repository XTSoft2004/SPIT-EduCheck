using System.ComponentModel.DataAnnotations;

namespace Domain.Model.Request.User
{
    public class ChangePwRequest
    {
        public long Id { get; set; }
        public string OldPassword { get; set; }
        public string Password { get; set; }
        [Compare(nameof(Password), ErrorMessage = "Mật khẩu không khớp")]
        public string ConfirmPassword { get; set; }
    }
}
