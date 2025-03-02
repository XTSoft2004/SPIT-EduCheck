using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Timesheet
{
    public class TimesheetRequest
    {
        public long Id { get; set; }
        public long StudentId { get; set; }
        public long ClassId { get; set; }
        public long TimeId { get; set; }
        public DateOnly Date { get; set; }
        public string Image_Check { get; set; }
        public string Status { get; set; }
        [StringLength(500)]
        public string Note { get; set; }
    }
}
