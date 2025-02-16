using Azure;
using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static Domain.Common.AppConstants;

namespace Server_Manager.Controllers
{
    public class UserController : Controller
    {
        private readonly IAuthServices? _services;

        public UserController(IAuthServices? services)
        {
            _services = services;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync([FromBody] RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(registerRequest);
            return response.ToActionResult();
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.LoginAsync(loginDTO);
            return response.ToActionResult();
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> Refresh_Token(string refreshToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.RefreshToken(refreshToken);
            return response.ToActionResult();
        }
    }
}
