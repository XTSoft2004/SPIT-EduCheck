using Domain.Interfaces.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json.Serialization;

namespace Domain.Common.Http
{
    public class HttpResponse : IHttpResponse
    {
        [JsonIgnore]
        public int StatusCode { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object Data { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Message { get; set; }

        public static HttpResponse OK(object data = null
            , string message = null
            , HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new HttpResponse()
            {
                Data = data,
                Message = message,
                StatusCode = (int)statusCode
            };
        }

        public static HttpResponse Error(string message = null
            , HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        {
            return new HttpResponse()
            {
                Message = message,
                StatusCode = (int)statusCode
            };
        }
        public IActionResult ToActionResult()
        {
            return new ObjectResult(this) { StatusCode = this.StatusCode };
        }
    }

    public class HttpResponse<T> : HttpResponse
    {
        public static HttpResponse<T> OK(T data = default(T)
            , string message = null
            , HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new HttpResponse<T>()
            {
                Data = data,
                Message = message,
                StatusCode = (int)statusCode
            };
        }

        public static new HttpResponse<T> Error(string message = null
            , HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        {
            return new HttpResponse<T>()
            {
                Message = message,
                StatusCode = (int)statusCode
            };
        }
    }
}
