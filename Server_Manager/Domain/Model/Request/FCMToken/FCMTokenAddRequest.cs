using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.FCMToken
{
    public class FCMTokenAddRequest
    {
        public string Username { get; set; }
        public string AccessToken { get; set; }
    }
}
