using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("extension")]
    [ApiController]
    public class ExtensionController : Controller
    {
        private readonly IExtensionServices _services;

        public ExtensionController(IExtensionServices services)
        {
            _services = services;
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
        public async Task<IActionResult> ImportClass([FromBody] string pathFile)
        {
            if (string.IsNullOrEmpty(pathFile))
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.ImportClass(pathFile);
            return response.ToActionResult();
        }
    }
}
