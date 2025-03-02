using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Model.Response.Class
{
    public class ClassResponse
    {
        public long Id { get; set; }
        [StringLength(100), Required]
        public string Code { get; set; }
        [StringLength(255), Required]
        public string Name { get; set; }
        [Required]
        public int Day { get; set; }
        [Required]
        public TimeOnly TimeStart { get; set; }
        [Required]
        public TimeOnly TimeEnd { get; set; }
        public long? LecturerId { get; set; }
        public long? CourseId { get; set; }
    }
}
