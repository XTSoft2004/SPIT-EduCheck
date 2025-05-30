﻿using Domain.Common.Http;
using Domain.Model.Request.Timesheet;
using Domain.Model.Response.Timesheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ITimesheetServices
    {
        List<TimesheetResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords);
        Task<HttpResponse> CreateAsync(TimesheetRequest timesheetRequest, string filePath);
        Task<HttpResponse> UpdateAsync(TimesheetRequest timesheetRequest, string filePath);
        Task<HttpResponse> DeleteAsync(long Id);
    }
}
