using Azure.Core;
using Domain.Common;
using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Extension;
using Domain.Model.Request.Timesheet;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("timesheet")]
    [ApiController]
    public class TimesheetController : Controller
    {
        private readonly ITimesheetServices _services;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public TimesheetController(ITimesheetServices services, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateTimesheet([FromBody] TimesheetRequest timesheetRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Timesheet");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var response = await _services.CreateAsync(timesheetRequest, uploadsFolder);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateTimesheet(long Id, [FromBody] TimesheetRequest timesheetRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Timesheet");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            timesheetRequest.Id = Id;
            timesheetRequest.Status = !string.IsNullOrEmpty(timesheetRequest.Status) ? timesheetRequest.Status : EnumExtensions.GetDisplayName(StatusTimesheet_Enum.Pending);
            var response = await _services.UpdateAsync(timesheetRequest, uploadsFolder);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteTimesheet(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllTimesheet(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            var timesheets = _services.GetAll(search, pageNumber, pageSize, out int totalRecords);

            if (timesheets == null)
                return BadRequest(new { Message = "Danh sách chấm công trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(timesheets, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
