﻿using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Semester;
using Microsoft.AspNetCore.Mvc;

namespace Server_Manager.Controllers
{
    [Route("semestrers")]
    [ApiController]
    public class SemestersController : Controller
    {
        private readonly ISemesterServices _services;

        public SemestersController(ISemesterServices services)
        {
            _services = services;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateSemester([FromBody] SemesterRequest semester)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            var response = await _services.CreateAsync(semester);
            return response.ToActionResult();
        }
        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateSemester(long Id, [FromBody] SemesterRequest semester)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Dữ liệu không hợp lệ !!!" });

            semester.Id = Id;
            var response = await _services.UpdateAsync(semester);
            return response.ToActionResult();
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteSemester(long Id)
        {
            var response = await _services.DeleteAsync(Id);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSemester(int pageNumber = 1, int pageSize = 10)
        {
            var semesters = _services.GetAll(pageNumber, pageSize, out int totalRecords);

            if (semesters == null || !semesters.Any())
                return BadRequest(new { Message = "Danh sách học kỳ trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(semesters, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
