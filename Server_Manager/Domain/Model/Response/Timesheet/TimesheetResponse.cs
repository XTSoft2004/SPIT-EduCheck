﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Timesheet
{
    public class TimesheetResponse
    {
        public long Id { get; set; }
        public List<long> StudentsId { get; set; }
        public long ClassId { get; set; }
        public long TimeId { get; set; }
        public DateOnly Date { get; set; }
        public string ImageBase64 { get; set; }
        public string Status { get; set; }
        [StringLength(500)]
        public string Note { get; set; }
    }
}
