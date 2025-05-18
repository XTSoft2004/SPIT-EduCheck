using Azure;
using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Student;
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
        [HttpPost("change-info")]
        public async Task<IActionResult> ChangeInfoMe([FromBody] ChangeInfoRequest changeInfoRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.ChangeInfoMe(changeInfoRequest);
            return response.ToActionResult();
        }

        [HttpGet("info-me")]
        public async Task<IActionResult> GetInfoMe()
        {
            var userResponse = await _services.GetInfoStudentMe();
            return userResponse.ToActionResult();
        }

        [HttpPost("change-avatar")]
        public async Task<IActionResult> ChangeAvatarMe([FromBody] UploadAvatar uploadAvatar)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.ChangeAvatarMe(uploadAvatar);
            return response.ToActionResult();
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userResponse = _services.GetMe();
            if (userResponse == null)
                return BadRequest(new { Message = "Thông tin không tồn tại, vui lòng kiểm tra lại !!!" });
            else
                return Ok(userResponse);
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userResponse = _services.GetProfile();
            if (userResponse == null)
                return BadRequest(new { Message = "Thông tin không tồn tại, vui lòng kiểm tra lại !!!" });
            else
                return Ok(userResponse);
        }
        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var users = _services.GetAllUsers(search, pageNumber, pageSize, out int totalRecords);

            if (users == null)
                return BadRequest(new { Message = "Danh sách người dùng trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(users, totalRecords, totalPages, pageNumber, pageSize));
        }
        [HttpGet("{Id}")]
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
        [Authorize(Roles = "Admin")]
        [HttpPost("ban-account")]
        public async Task<IActionResult> BanAccount(long IdUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.BanAccount(IdUser);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("change-password-admin")]
        public async Task<IActionResult> ChangeAccountAdmin([FromBody] ChangePwAdminRequest changePwAdminRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.ChangePasswordAdmin(changePwAdminRequest);
            return response.ToActionResult();
        }
        [HttpGet("set-semester/{Id}")]
        public async Task<IActionResult> SetSemesterUser(long Id)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.SetSemesterUser(Id);
            return response.ToActionResult();
        }

        [HttpGet("fcm-token-me")]
        public async Task<IActionResult> GetFCMTokenMe()
        {
            var userResponse = _services.GetFCMTokenMe();
            if (userResponse == null)
                return BadRequest(new { Message = "Người dùng không tồn tại !!!" });
            else
                return Ok(userResponse);
        }
    }
}
