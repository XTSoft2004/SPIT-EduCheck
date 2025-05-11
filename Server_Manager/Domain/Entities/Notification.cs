using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Base;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class Notification : EntityBase
    {
        [Required, StringLength(100)]
        public string Title { get; set; }
        [Required, StringLength(500)]
        public string Body { get; set; }
        public bool isRead { get; set; }

        public long StudentId { get; set; }
        [ForeignKey(nameof(StudentId))]
        public virtual Student? Student { get; set; }
    }
}
