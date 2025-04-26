using Domain.Common.GoogleDriver.Model.Request;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("driver")]
    [ApiController]
    public class GoogleDriverController : Controller
    {
        private readonly IGoogleDriverServices googleDriver;
        public GoogleDriverController(IGoogleDriverServices? googleDriver)
        {
            this.googleDriver = googleDriver;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(UploadFileRequest uploadFileRequest)
        {
            if (uploadFileRequest.fileUpload == null || uploadFileRequest.fileUpload.Length == 0)
                return BadRequest(new { Message = "File không hợp lệ !!!" });

            var imageUrl = await googleDriver.UploadImage(uploadFileRequest);

            if (imageUrl == null)
                return BadRequest(new { Message = "Lỗi khi upload file !!!" });

            using (var httpClient = new HttpClient())
            {
                var imageStream = await httpClient.GetStreamAsync(imageUrl);
                return File(imageStream, "image/jpeg"); // hoặc image/png tùy định dạng
            }
        }
        [HttpGet("preview")]
        public async Task<IActionResult> PreviewImage(string fileId)
        {
            var imageUrl = $"https://drive.google.com/uc?export=view&id={fileId}";

            if (imageUrl == null)
                return BadRequest(new { Message = "Lỗi khi preview file !!!" });

            using (var httpClient = new HttpClient())
            {
                var imageStream = await httpClient.GetStreamAsync(imageUrl);
                return File(imageStream, "image/jpeg"); // hoặc image/png tùy định dạng
            }
        }
    }
}
