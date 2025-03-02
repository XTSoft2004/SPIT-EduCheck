using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Semester
{
    public class SemesterRequest
    {
        public long Id { get; set; }
        [Required]
        public int Semesters_Number { get; set; }
        [Required]
        public int Year { get; set; }

    }
}
