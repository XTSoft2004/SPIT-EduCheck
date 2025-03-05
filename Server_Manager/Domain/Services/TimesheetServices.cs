using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Timesheet;
using Domain.Model.Response.Timesheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class TimesheetServices : BaseService, ITimesheetServices
    {
        private readonly IRepositoryBase<Timesheet> _Timesheet;
        private readonly IRepositoryBase<Student> _Student;
        private readonly IRepositoryBase<Class> _Class;
        private readonly IRepositoryBase<Time> _Time;

        public TimesheetServices(IRepositoryBase<Timesheet> timesheet, IRepositoryBase<Student> student, IRepositoryBase<Class> @class, IRepositoryBase<Time> time)
        {
            _Timesheet = timesheet;
            _Student = student;
            _Class = @class;
            _Time = time;
        }

        public async Task<HttpResponse> CreateAsync(CreateTimesheetRequest timesheetRequest)
        {
            if (timesheetRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            //if (!EnumExtensions.IsValidDisplayName(timesheetRequest.Status, typeof(StatusTimesheet_Enum)))
            //    return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(f => f.Id == timesheetRequest.StudentId);
            if (_student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);

            var _class = _Class.Find(f => f.Id == timesheetRequest.ClassId);
            if (_class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);

            var _time = _Time.Find(f => f.Id == timesheetRequest.TimeId);
            if (_time == null)
                return HttpResponse.Error("Không tìm thấy thời gian học.", System.Net.HttpStatusCode.NotFound);

            var _timesheet = _Timesheet.Find(f => f.StudentId == timesheetRequest.StudentId
                            && f.ClassId == timesheetRequest.ClassId
                            && f.TimeId == timesheetRequest.TimeId
                            && f.Date == timesheetRequest.Date);

            if (_timesheet != null)
                return HttpResponse.Error("Đã tồn tại điểm danh này trong hệ thống, vui lòng kiểm tra lại !!", System.Net.HttpStatusCode.BadRequest);
            else
            {
                var Timesheet = new Timesheet()
                {
                    StudentId = timesheetRequest.StudentId,
                    ClassId = timesheetRequest.ClassId,
                    TimeId = timesheetRequest.TimeId,
                    Date = timesheetRequest.Date,
                    Image_Check = timesheetRequest.Image_Check,
                    Status = EnumExtensions.GetDisplayName(StatusTimesheet_Enum.Pending),
                    Note = timesheetRequest.Note,
                    CreatedDate = DateTime.Now,
                };
                _Timesheet.Insert(Timesheet);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Điểm danh thành công.");
            }
        }
        public async Task<HttpResponse> UpdateAsync(TimesheetRequest timesheetRequest)
        {
            if (timesheetRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(f => f.Id == timesheetRequest.StudentId);
            if (_student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);
        
            if (EnumExtensions.IsValidDisplayName(timesheetRequest.Status, typeof(StatusTimesheet_Enum)))
                return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var _class = _Class.Find(f => f.Id == timesheetRequest.ClassId);
            if (_class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);

            var _time = _Time.Find(f => f.Id == timesheetRequest.TimeId);
            if (_time == null)
                return HttpResponse.Error("Không tìm thấy thời gian học.", System.Net.HttpStatusCode.NotFound);

            var _timesheet = _Timesheet.Find(f => f.Id == timesheetRequest.Id);
            if(_timesheet == null)
                return HttpResponse.Error("Không tìm thấy điểm danh.", System.Net.HttpStatusCode.NotFound);
            else if(_Timesheet.Find(f => f.StudentId == timesheetRequest.StudentId
                            && f.ClassId == timesheetRequest.ClassId
                            && f.TimeId == timesheetRequest.TimeId
                            && f.Date == timesheetRequest.Date
                            && f.Id != timesheetRequest.Id) != null)
                return HttpResponse.Error("Đã tồn tại điểm danh này trong hệ thống, vui lòng kiểm tra lại !!", System.Net.HttpStatusCode.BadRequest);
            else
            {
                _timesheet.Image_Check = timesheetRequest.Image_Check;
                _timesheet.Status = timesheetRequest.Status;
                _timesheet.Note = timesheetRequest.Note;
                _timesheet.ModifiedDate = DateTime.Now;
                _Timesheet.Update(_timesheet);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật điểm danh thành công.");
            }
        }

        public async Task<HttpResponse> DeleteAsync(long Id)
        {
            var timesheet = _Timesheet.Find(f => f.Id == Id);
            if(timesheet == null)
                return HttpResponse.Error("Không tìm thấy điểm danh.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _Timesheet.Delete(timesheet);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa điểm danh thành công.");
            }
        }

        public List<TimesheetResponse> GetAll(int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _Timesheet.All();
            totalRecords = query.Count(); // Đếm tổng số bản ghi

            if (pageNumber != -1 && pageSize != -1)
            {
                // Sắp xếp phân trang
                query = query.OrderBy(u => u.Id)
                             .Skip((pageNumber - 1) * pageSize)
                             .Take(pageSize);
            }
            else
            {
                query = query.OrderBy(u => u.Id); // Sắp xếp nếu không phân trang
            }

            var timesheets = query
                .Select(f => new TimesheetResponse
                {
                    Id = f.Id,
                    StudentId = f.StudentId,
                    ClassId = f.ClassId,
                    TimeId = f.TimeId,
                    Date = f.Date,
                    Image_Check = f.Image_Check,
                    Status = f.Status,
                    Note = f.Note,
                }).ToList();

            return timesheets;
        }

    }
}
