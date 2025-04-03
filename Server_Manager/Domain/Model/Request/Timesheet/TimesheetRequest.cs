using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain.Model.Request.Timesheet
{
    public class TimesheetRequest
    {
        public long Id { get; set; }
        public List<long> StudentsId { get; set; }
        public long ClassId { get; set; }
        public long TimeId { get; set; }
        public DateOnly Date { get; set; }
        [Required]
        public IFormFile ImageFile { get; set; }
        public string Status { get; set; }
        [StringLength(500)]
        public string Note { get; set; }
    }
}
