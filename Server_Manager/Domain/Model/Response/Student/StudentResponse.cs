using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model.Response.Student
{
    public class StudentResponse
    {
        //[JsonIgnore]
        public long Id { get; set; }
        public string MaSinhVien { get; set; }
        public string FristName { get; set; }
        public string LastName { get; set; }
        public string Class { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool? Gender { get; set; }
        public DateOnly? Dob { get; set; }
        public string? UserName { get; set; }
    }
}
