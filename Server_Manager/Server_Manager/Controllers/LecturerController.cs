using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Lecturer;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("lecturer")]
    [ApiController]
    public class LecturerController : Controller
    {
        private readonly ILecturerServices _services;

        public LecturerController(ILecturerServices services)
        {
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateLecturer([FromBody] LecturerRequest lecturerRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(lecturerRequest);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateLecturer(long Id, [FromBody] LecturerRequest lecturerRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            lecturerRequest.Id = Id;
            var response = await _services.UpdateAsync(lecturerRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteLecturer(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllLecturer(int pageNumber = 1, int pageSize = 10)
        {
            var users = _services.GetAll(pageNumber, pageSize, out int totalRecords);

            if (users == null || !users.Any())
                return BadRequest(new { Message = "Danh sách giảng viên trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(users, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
