using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Student;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("student")]
    [ApiController]
    public class StudentController : Controller
    {
        private readonly IStudentServices _services;

        public StudentController(IStudentServices services)
        {
            _services = services;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateStudent([FromBody] StudentRequest studentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(studentRequest);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateStudent(long Id, [FromBody] StudentRequest studentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            studentRequest.Id = Id;
            var response = await _services.UpdateAsync(studentRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteStudent(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet("add-user")]
        public async Task<IActionResult> AddStudentInUser(long IdUser, long IdStudent)
        {
            var response = await _services.AddStudentInUser(IdUser, IdStudent);
            return response.ToActionResult();
        }
        [HttpGet("remove-user")]
        public async Task<IActionResult> RemoveStudentInUser(long IdUser)
        {
            var response = await _services.RemoveStudentInUser(IdUser);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllStudent(int pageNumber = 1, int pageSize = 10)
        {
            var users = _services.GetAll(pageNumber, pageSize, out int totalRecords);

            if (users == null || !users.Any())
                return BadRequest(new { Message = "Danh sách sinh viên trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(users, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
