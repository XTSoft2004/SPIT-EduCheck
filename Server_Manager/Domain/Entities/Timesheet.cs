using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Timesheet : EntityBase
    {
        public long ClassId { get; set; }
        [ForeignKey(nameof(ClassId))]
        public virtual Class Class { get; set; }

        public long TimeId { get; set; }
        [ForeignKey(nameof(TimeId))]
        public virtual Time Time { get; set; }
        public DateOnly Date { get; set; }
        public string Image_Check { get; set; }
        public string Status { get; set; }
        [StringLength(500)]
        public string Note { get; set; }
    }
}
