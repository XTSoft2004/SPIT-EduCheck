using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Notification
{
    public class NotificationRequest
    {
        public long StudentId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}
