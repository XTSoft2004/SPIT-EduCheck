using Domain.Interfaces.Services;
using Domain.Model.Request.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserServices _services;

        public UserController(IUserServices services)
        {
            _services = services;
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userResponse = _services.GetMe();
            if(userResponse == null)
                return BadRequest(new { Message = "Thông tin không tồn tại, vui lòng kiểm tra lại !!!" });
            else
                return Ok(userResponse);
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var userResponse = _services.GetAllUsers();
            if (userResponse == null)
                return BadRequest(new { Message = "Danh sách người dùng trống !!!" });
            else
                return Ok(userResponse);
        }
        [HttpGet("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(long Id)
        {
            var userResponse = _services.GetUserById(Id);
            if (userResponse == null)
                return BadRequest(new { Message = "Người dùng không tồn tại !!!" });
            else
                return Ok(userResponse);
        }
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePwRequest changePwRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.ChangePassword(changePwRequest);
            return response.ToActionResult();
        }
    }
}
