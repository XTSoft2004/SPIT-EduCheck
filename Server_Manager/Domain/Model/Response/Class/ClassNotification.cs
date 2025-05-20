using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Class
{
    public class ClassNotification
    {
        public long Id { get; set; }    
        public string Name { get; set; }
        public bool isNotification { get; set; }
    }
}
