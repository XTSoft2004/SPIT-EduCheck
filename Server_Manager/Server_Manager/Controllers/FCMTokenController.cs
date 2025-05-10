using Domain.Interfaces.Services;
using Domain.Model.Request.FCMToken;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("fcmtoken")]
    [ApiController]
    public class FCMTokenController : Controller
    {
        private readonly IFCMTokenServices _services;

        public FCMTokenController(IFCMTokenServices services)
        {
            _services = services;
        }
       
        [HttpPost("register")]
        public async Task<IActionResult> RegisterFCMToken([FromBody] FCMTokenRequest fcmTokenRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.RegisterFCMToken(fcmTokenRequest);
            return response.ToActionResult();
        }

        [HttpDelete("remove/{username}")]
        public async Task<IActionResult> RemoveFCMToken(string username)
        {
            var response = await _services.RemoveFCMToken(username);
            return response.ToActionResult();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest notificationRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.SendNotification(notificationRequest);
            return response.ToActionResult();
        }
    }
}
