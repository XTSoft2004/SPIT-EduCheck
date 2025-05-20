using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Services;
using Domain.Model.Request.Class;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("class")]
    [ApiController]
    public class ClassController : Controller
    {
        private readonly IClassServices _services;

        public ClassController(IClassServices services)
        {
            _services = services;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateClass([FromBody] ClassRequest classRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(classRequest);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateClass(long Id, [FromBody] ClassRequest classRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            classRequest.Id = Id;
            var response = await _services.UpdateAsync(classRequest);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteClass(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllClass(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var classResponses = _services.GetAll(search, pageNumber, pageSize, out int totalRecords);

            if (classResponses == null)
                return BadRequest(new { Message = "Danh sách lớp trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(classResponses, totalRecords, totalPages, pageNumber, pageSize));
        }
        [HttpGet]
        public async Task<IActionResult> GetAllClassSemester(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var classResponses = _services.GetClassInSemester(search, pageNumber, pageSize, out int totalRecords);

            if (classResponses == null)
                return BadRequest(new { Message = "Danh sách lớp trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(classResponses, totalRecords, totalPages, pageNumber, pageSize));
        }
        [HttpGet("class-notification")]
        public async Task<IActionResult> GetClassNotificationMe()
        {
            var response = await _services.GetClassNotificationMe();
            return response.ToActionResult();
        }
    }
}
