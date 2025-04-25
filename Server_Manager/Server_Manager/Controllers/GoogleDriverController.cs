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

            var response = await googleDriver.UploadFile(uploadFileRequest);

            if(response == null)
                return BadRequest(new { Message = "Lỗi khi upload file !!!" });
            else
                return Ok(new { Message = "Upload thành công !!!", Data = response });
        }
    }
}
