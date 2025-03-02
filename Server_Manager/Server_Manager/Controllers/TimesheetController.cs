using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Timesheet;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("timesheet")]
    [ApiController]
    public class TimesheetController : Controller
    {
        private readonly ITimesheetServices _services;

        public TimesheetController(ITimesheetServices services)
        {
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateTimesheet([FromBody] CreateTimesheetRequest timesheetRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(timesheetRequest);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateTimesheet([FromBody] TimesheetRequest timesheetRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.UpdateAsync(timesheetRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteTimesheet(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllTimesheet(int pageNumber = 1, int pageSize = 10)
        {
            var timesheets = _services.GetAll(pageNumber, pageSize, out int totalRecords);

            if (timesheets == null || !timesheets.Any())
                return BadRequest(new { Message = "Danh sách chấm công trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(timesheets, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
