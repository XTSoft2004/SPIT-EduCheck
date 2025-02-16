using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model.Response.User
{
    public class UserResponse
    {
        [JsonIgnore]
        public long Id { get; set; }
        public string? Username { get; set; }
        public bool IsLocked { get; set; }
        public bool IsVerify { get; set; }
        public string? RoleName { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
