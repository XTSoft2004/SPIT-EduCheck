using Domain.Interfaces.Common;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace Domain.Common
{
    public class HttpContextHelper : IHttpContextHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextHelper(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Lấy địa chỉ IP của client
        /// </summary>
        public string GetClientIp()
        {
            return _httpContextAccessor?.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        }

        /// <summary>
        /// Lấy User-Agent từ request
        /// </summary>
        public string GetUserAgent()
        {
            return _httpContextAccessor?.HttpContext?.Request.Headers["User-Agent"].FirstOrDefault() ?? "Unknown";
        }

        /// <summary>
        /// Lấy giá trị của một header cụ thể
        /// </summary>
        public string GetHeader(string key)
        {
            return _httpContextAccessor?.HttpContext?.Request.Headers[key].FirstOrDefault() ?? "";
        }
        /// <summary>
        /// Lấy giá trị của một item trong HttpContext
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string GetItem(string key)
        {
            return _httpContextAccessor?.HttpContext?.Items[key]?.ToString() ?? "";
        }
        /// <summary>
        /// Lấy URL hiện tại của request
        /// </summary>
        public string GetCurrentUrl()
        {
            var request = _httpContextAccessor?.HttpContext?.Request;
            if (request == null) return "";
            return $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
        }
    }
}
