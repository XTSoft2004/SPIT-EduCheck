using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class TokenInfoGoogleResponse
    {
        public string azp { get; set; }
        public string aud { get; set; }
        public string scope { get; set; }
        public string exp { get; set; }
        public string expires_in { get; set; }
        public string access_type { get; set; }
    }
}
