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
        //[JsonIgnore]
        public long Id { get; set; }
        public string? Username { get; set; }
        public bool IsLocked { get; set; }
        public bool IsVerify { get; set; }

        public string? RoleName { get; set; }

        //[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public long? SemesterId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? AccessToken { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? RefreshToken { get; set; }

        //[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? StudentName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
