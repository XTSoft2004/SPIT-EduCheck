using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.FCMToken
{
    public class NotificationRequest
    {
        public string Username { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}
