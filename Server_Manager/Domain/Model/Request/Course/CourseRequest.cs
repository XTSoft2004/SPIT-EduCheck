using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Course
{
    public class CourseRequest
    {
        public long Id { get; set; }
        [StringLength(100), Required]
        public string Code { get; set; }
        [StringLength(255), Required]
        public string Name { get; set; }
        [Required]
        public int Credits { get; set; }
        
        public long SemesterId { get; set; }
    }
}
