using Domain.Interfaces.Services;
using Domain.Model.Request.Extension;
using Domain.Model.Request.Timesheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("extension")]
    [ApiController]
    public class ExtensionController : Controller
    {
        private readonly IExtensionServices _services;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ExtensionController(IExtensionServices services, IWebHostEnvironment webHostEnvironment)
        {
            _services = services;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet("ConvertImage")]
        public async Task<IActionResult> ConvertImage()
        {
            var response = await _services.ConvertImageToLink();
            return response.ToActionResult();
        }

        [HttpPost("CreateAccount")]
        public async Task<IActionResult> CreateAccountByStudentId([FromBody] List<string> studentsMSV)
        {
            if (studentsMSV == null || studentsMSV.Count == 0)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAccountByStudentId(studentsMSV);
            return response.ToActionResult();
        }
        [HttpPost("ImportClass")]
        [Consumes("multipart/form-data")] // Đảm bảo Swagger nhận diện đúng loại dữ liệu
        public async Task<IActionResult> ImportClass([FromForm] ClassImportRequest classImportRequest) // Sử dụng FromForm thay vì FromBody
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "ClassesImport");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file duy nhất
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(classImportRequest.FileUpload.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Lưu file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await classImportRequest.FileUpload.CopyToAsync(fileStream);
            }

            var response = await _services.ImportClass(filePath);
            return response.ToActionResult();
        }
        [HttpPost("ImportTimesheet")]
        public async Task<IActionResult> ImportTimesheet([FromBody] TimesheetUpload[] timesheetImport) // Sử dụng FromForm thay vì FromBody
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Timesheet");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var response = await _services.ImportTimesheet(timesheetImport, uploadsFolder);
            return response.ToActionResult();
        }

        [AllowAnonymous]
        [HttpGet("image")]
        public async Task<IActionResult> ShowImage(string nameFile)
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Timesheet");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            byte[] imageBytes = System.IO.File.ReadAllBytes(Path.Combine(uploadsFolder, nameFile));
            return File(imageBytes, "image/png");
        }
        [AllowAnonymous]
        [HttpGet("base64")]
        public async Task<IActionResult> GetBase64Image(string nameFile)
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Timesheet");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string pathFile = Path.Combine(uploadsFolder, nameFile);
            if (!System.IO.File.Exists(pathFile))
                return NotFound(new { Message = "File không tồn tại !!!" });

            byte[] imageBytes = System.IO.File.ReadAllBytes(Path.Combine(uploadsFolder, nameFile));
            string base64String = Convert.ToBase64String(imageBytes);
            return Ok(base64String);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] UploadFileRequest uploadFileRequest)
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);
            // Tạo tên file duy nhất
            var response = await _services.UploadFile(uploadsFolder, uploadFileRequest);
            return response.ToActionResult();
        }
    }
}
