using Domain.Interfaces.Services;
using Domain.Model.Request.Timesheet;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
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

        [HttpPost("CreateAccount")]
        public async Task<IActionResult> CreateAccountByStudentId([FromBody] List<string> studentsMSV)
        {
            if (studentsMSV == null || studentsMSV.Count == 0)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAccountByStudentId(studentsMSV);
            return response.ToActionResult();
        }
        [HttpPost("ImportClass")]
        public async Task<IActionResult> ImportClass([FromForm] IFormFile fileUpload)
        {
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "ClassesImport");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file duy nhất
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(fileUpload.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Lưu file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await fileUpload.CopyToAsync(fileStream);
            }

            var response = await _services.ImportClass(filePath);
            return response.ToActionResult();
        }
    }
}
