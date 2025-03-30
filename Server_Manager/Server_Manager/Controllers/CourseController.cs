using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("course")]
    [ApiController]
    public class CourseController : Controller
    {
        private readonly ICourseServices _services;

        public CourseController(ICourseServices services)
        {
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateCourse([FromBody] CourseRequest courseRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(courseRequest);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateCourse(long Id, [FromBody] CourseRequest courseRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            courseRequest.Id = Id;
            var response = await _services.UpdateAsync(courseRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteCourse(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCourse(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var courses = _services.GetAll(search, pageNumber, pageSize, out int totalRecords);

            if (courses == null || !courses.Any())
                return BadRequest(new { Message = "Danh sách môn học trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(courses, totalRecords, totalPages, pageNumber, pageSize));
        }
        [HttpGet("remove-semester")]
        public async Task<IActionResult> Remove_Semester_To_Course(long CourseId)
        {
            var response = await _services.Remove_Semester_To_Course(CourseId);
            return response.ToActionResult();
        }
    }
}
