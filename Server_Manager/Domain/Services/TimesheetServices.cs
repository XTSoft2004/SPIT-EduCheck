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
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class TimesheetServices : BaseService, ITimesheetServices
    {
        private readonly IRepositoryBase<Timesheet_Students> _TimesheetStudents;
        private readonly IRepositoryBase<Timesheet> _Timesheet;
        private readonly IRepositoryBase<Student> _Student;
        private readonly IRepositoryBase<Class> _Class;
        private readonly IRepositoryBase<Time> _Time;
        private readonly IClassServices _ClassServices;

        public TimesheetServices(IRepositoryBase<Timesheet> timesheet, 
            IRepositoryBase<Student> student, 
            IRepositoryBase<Class> @class, 
            IRepositoryBase<Time> time,
            IRepositoryBase<Timesheet_Students> timesheetstudents,
            IClassServices classServices)
        {
            _Timesheet = timesheet;
            _Student = student;
            _Class = @class;
            _Time = time;
            _TimesheetStudents = timesheetstudents;
            _ClassServices = classServices;
        }

        public async Task<HttpResponse> CreateAsync(TimesheetRequest timesheetRequest, string pathSave)
        {
            if (timesheetRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);



            //if (!EnumExtensions.IsValidDisplayName(timesheetRequest.Status, typeof(StatusTimesheet_Enum)))
            //    return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(f => timesheetRequest.StudentsId.Contains(f.Id));
            if (_student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);

            var _class = _Class.Find(f => f.Id == timesheetRequest.ClassId);
            if (_class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);

            var _time = _Time.Find(f => f.Id == timesheetRequest.TimeId);
            if (_time == null)
                return HttpResponse.Error("Không tìm thấy thời gian học.", System.Net.HttpStatusCode.NotFound);

            var _timesheet = _Timesheet.Find(f => f.ClassId == timesheetRequest.ClassId
                          && f.TimeId == timesheetRequest.TimeId
                          && f.Date == timesheetRequest.Date);

            if (_timesheet != null)
                return HttpResponse.Error("Đã tồn tại điểm danh này trong hệ thống, vui lòng kiểm tra lại !!", System.Net.HttpStatusCode.BadRequest);
            else
            {
                string filePath = Path.Combine(pathSave, $"{_class.Name}_{DateTime.Now.ToString("yyyy-MM-dd_hh-mm-ss_tt")}_{_student.UserId}.png");
                byte[] imageBytes = Convert.FromBase64String(timesheetRequest.ImageBase64.Split(',')[1]);
                File.WriteAllBytes(filePath, imageBytes);

                var Timesheet = new Timesheet()
                {
                    ClassId = timesheetRequest.ClassId,
                    TimeId = timesheetRequest.TimeId,
                    Date = timesheetRequest.Date,
                    Image_Check = filePath,
                    Status = EnumExtensions.GetDisplayName(StatusTimesheet_Enum.Pending),
                    Note = timesheetRequest.Note,
                    CreatedDate = DateTime.Now,
                };
                _Timesheet.Insert(Timesheet);
                await UnitOfWork.CommitAsync();

                var Students = _Student.ListBy(l => timesheetRequest.StudentsId.Contains(l.Id));
                foreach(Student student in Students)
                {
                    _TimesheetStudents.Insert(new Timesheet_Students()
                    {
                        Student = student,
                        Timesheet = Timesheet
                    });
                }
                await UnitOfWork.CommitAsync();

                return HttpResponse.OK(message: "Điểm danh thành công.");
            }
        }
        public async Task<HttpResponse> UpdateAsync(TimesheetRequest timesheetRequest, string pathSave)
        {
            if (timesheetRequest == null)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var _student = _Student.Find(f => timesheetRequest.StudentsId.Contains(f.Id));
            if (_student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);
        
            if (!EnumExtensions.IsValidDisplayName(timesheetRequest.Status, typeof(StatusTimesheet_Enum)))
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
            else if (_Timesheet.Find(f => timesheetRequest.StudentsId.Contains(f.Id)
                           && f.ClassId == timesheetRequest.ClassId
                           && f.TimeId == timesheetRequest.TimeId
                           && f.Date == timesheetRequest.Date
                           && f.Id != timesheetRequest.Id) != null)
                return HttpResponse.Error("Đã tồn tại điểm danh này trong hệ thống, vui lòng kiểm tra lại !!", System.Net.HttpStatusCode.BadRequest);
            else
            {
                string filePath = Path.Combine(pathSave, $"{_class.Name}_{DateTime.Now.ToString("yyyy-MM-dd_hh-mm-ss_tt")}_{_student.UserId}.png");
                byte[] imageBytes = Convert.FromBase64String(timesheetRequest.ImageBase64);
                File.WriteAllBytes(filePath, imageBytes);

                var StudentsTimesheet = _TimesheetStudents.ListBy(l => l.TimesheetId == timesheetRequest.Id).Select(s => s.StudentId).ToList();
                var StudentIdRemove = StudentsTimesheet.Except(timesheetRequest.StudentsId).ToList();
                var StudentRemove = _TimesheetStudents.ListBy(l => StudentIdRemove.Contains(l.StudentId) && l.TimesheetId == timesheetRequest.Id);
                _TimesheetStudents.DeleteRange(StudentRemove);

                var StudentIdAdd = timesheetRequest.StudentsId.Except(StudentsTimesheet).ToList();
                _TimesheetStudents.InsertRange(new List<Timesheet_Students>(StudentIdAdd.Select(s => new Timesheet_Students()
                {
                    StudentId = s,
                    TimesheetId = timesheetRequest.Id
                })));
                await UnitOfWork.CommitAsync();

                _timesheet.Date = timesheetRequest.Date;
                _timesheet.Class = _class;
                _timesheet.Time = _time;
                _timesheet.Image_Check = filePath;
                //_timesheet.Image_Check = timesheetRequest.Image_Check;
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

        public List<TimesheetResponse> GetAll(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            // Lấy danh sách ID của lớp học trong học kỳ hiện tại
            var classIds = _ClassServices.GetClassInSemester(string.Empty, -1, -1, out _)?
                .Select(s => s.Id)
                .ToList();

            if (classIds == null || !classIds.Any())
            {
                totalRecords = 0;
                return new List<TimesheetResponse>();
            }

            var query = _Timesheet.All().Where(w => classIds.Contains(w.ClassId));

            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(f =>
                    f.Class.Name.Contains(searchLower) ||
                    f.Time.Name.Contains(searchLower) ||
                    f.Date.ToString().Contains(searchLower) ||
                    f.Status.Contains(searchLower) ||
                    f.Note.Contains(searchLower));
            }

            // Đếm số bản ghi trước khi phân trang
            totalRecords = query.Count();

            // Sắp xếp theo ID và áp dụng phân trang nếu cần
            query = query.OrderBy(u => u.Id);
            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Lấy danh sách tất cả studentId liên quan đến timesheet
            var timesheetIds = query.Select(t => t.Id).ToList();
            var studentMap = _TimesheetStudents.All()
                .Where(ts => timesheetIds.Contains(ts.TimesheetId))
                .GroupBy(ts => ts.TimesheetId)
                .ToDictionary(g => g.Key, g => g.Select(s => s.StudentId).ToList());

            // Chuyển đổi dữ liệu
            return query.Select(f => new TimesheetResponse
            {
                Id = f.Id,
                StudentsId = studentMap.ContainsKey(f.Id) ? studentMap[f.Id] : new List<long>(),
                ClassId = f.ClassId,
                TimeId = f.TimeId,
                Date = f.Date,
                ImageBase64 = Convert.ToBase64String(File.ReadAllBytes(f.Image_Check)),
                Status = f.Status,
                Note = f.Note
            }).ToList();
        }
    }
}
