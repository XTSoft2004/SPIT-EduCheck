using Domain.Entities;
using Domain.Model.Response.Class;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model.Response.Lecturer
{
    public class LecturerResponse
    {
        public long Id { get; set; }
        [StringLength(255), Required]
        public string FullName { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(10)]
        public string PhoneNumber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ICollection<ClassResponse> ClassResponse { get; set; }
    }
}
