using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    public class StatisticController : Controller
    {
        private IStatisticServices? _services;

        public StatisticController(IStatisticServices? services)
        {
            _services = services;
        }

        [HttpGet("statistic-class")]
        public async Task<IActionResult> GetStatisticClass()
        {
            var response = _services.GetStatisticClass();
            if (response == null)
                return BadRequest(new { Message = "Không có thông tin thống kê !!!" });
            else
                return Ok(response);
        }
        [HttpGet("statistic-info")]
        public async Task<IActionResult> GetStatisticInfo()
        {
            var response = _services.GetStatisticInfo();
            if (response == null)
                return BadRequest(new { Message = "Không có thông tin thống kê !!!" });
            else
                return Ok(response);
        }
        [HttpGet("statistic-salary")]
        public async Task<IActionResult> GetStatisticInfoSalary()
        {
            var response = _services.GetStatisticInfoSalary();
            if (response == null)
                return BadRequest(new { Message = "Không có thông tin thống kê !!!" });
            else
                return Ok(response);
        }
    }
}
