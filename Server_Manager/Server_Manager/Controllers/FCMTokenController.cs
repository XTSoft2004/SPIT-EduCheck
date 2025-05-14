using Domain.Interfaces.Services;
using Domain.Model.Request.FCMToken;
using Domain.Model.Request.Notification;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("fcmtoken")]
    [ApiController]
    public class FCMTokenController : Controller
    {
        private readonly IFCMTokenServices _services;
        private readonly INotificationServices _notificationServices;

        public FCMTokenController(IFCMTokenServices services, INotificationServices notificationServices)
        {
            _services = services;
            _notificationServices = notificationServices;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterFCMToken([FromBody] FCMTokenRequest fcmTokenRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.RegisterFCMToken(fcmTokenRequest);
            return response.ToActionResult();
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveFCMToken(FCMTokenRequest fCMTokenRemoveRequest)
        {
            var response = await _services.RemoveFCMToken(fCMTokenRemoveRequest);
            return response.ToActionResult();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest notificationRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });
            var response = await _services.SendNotification(notificationRequest);

            if(response.StatusCode == 200)
                await _notificationServices.CreateNotification(notificationRequest);
            return response.ToActionResult();
        }
    }
}
