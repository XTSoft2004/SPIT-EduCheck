using Domain.Interfaces.Services;
using Domain.Model.DTOs;
using Domain.Model.Request.User;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Server_Manager.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices? _services;

        public AuthController(IAuthServices? services)
        {
            _services = services;
        }
        [HttpPost("sign-up")]
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
        [HttpGet("refresh-token")]
        public async Task<IActionResult> Refresh_Token(string refreshToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.RefreshToken(refreshToken);
            return response.ToActionResult();
        }
        [HttpGet("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var response = await _services.LogoutAsync();
            return response.ToActionResult();
        }
    }
}
