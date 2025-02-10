namespace Domain.Interfaces.Http
{
    public interface IHttpResponse
    {
        int StatusCode { get; set; }
        object Data { get; set; }
        string Message { get; set; }
    }
}
