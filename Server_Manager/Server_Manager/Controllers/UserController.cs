﻿using Domain.Common.Http;
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
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var users = _services.GetAllUsers(search, pageNumber, pageSize, out int totalRecords);

            if (users == null || !users.Any())
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
        [HttpGet("set-semester/{Id}")]
        public async Task<IActionResult> SetSemesterUser(long Id)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.SetSemesterUser(Id);
            return response.ToActionResult();
        }
    }
}
