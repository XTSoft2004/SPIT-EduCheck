using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Common
{
    public interface IHttpContextHelper
    {
        string GetClientIp();
        string GetUserAgent();
        string GetHeader(string key);
        string GetItem(string key);
        string GetCurrentUrl();
    }
}
