using Domain.Common.Http;
using System.Drawing.Printing;
using Domain.Interfaces.Services;
using Domain.Model.Response.Class;
using Microsoft.AspNetCore.Mvc;
using Domain.Model.Request.Notification;

namespace Server_Manager.Controllers
{
    [Route("notification")]
    [ApiController]
    public class NotificationController : Controller
    {
        private readonly INotificationServices _services;
        public NotificationController(INotificationServices services)
        {
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationRequest notificationRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateNotification(notificationRequest);
            return response.ToActionResult();
        }

        [HttpGet]
        public async Task<IActionResult> GetNotification()
        {
            var response = await _services.GetNotificationByStudentId();
            return Ok(ResponseArray.ResponseList(response, -1, response.Count(), -1, -1));
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveNotification([FromQuery] long IdNotification)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.DeleteNotification(IdNotification);
            return response.ToActionResult();
        }

        [HttpPost("active")]
        public async Task<IActionResult> ActiveNotification([FromQuery] long ClassId, [FromQuery] long StudentId)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.ActiveNotification(ClassId, StudentId);
            return response.ToActionResult();
        }

    }
}
