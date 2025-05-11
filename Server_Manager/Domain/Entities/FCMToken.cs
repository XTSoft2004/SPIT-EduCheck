using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class FCMToken : EntityBase
    {

        [StringLength(50), Required]
        public long StudentId { get; set; }

        [StringLength(500), Required]
        public string AccessToken { get; set; }
    }
}
