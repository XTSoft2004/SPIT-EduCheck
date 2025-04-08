using Domain.Base.Services;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Response.Auth;
using Domain.Model.Response.Statistic;
using Domain.Model.Response.Student;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class StatisticServices: BaseService , IStatisticServices
    {
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Student> _Student;
        private readonly IHttpContextHelper _HttpContextHelper;
        private readonly ITokenServices _TokenServices;
        private readonly ITimesheetServices _TimesheetServices;
        private readonly IClassServices _ClassServices;
        private AuthToken? _AuthToken;
        public StatisticServices(IRepositoryBase<User> user, IRepositoryBase<Student> student, IHttpContextHelper httpContextHelper, ITokenServices tokenServices, ITimesheetServices timesheetServices, IClassServices classServices)
        {
            _User = user;
            _Student = student;
            _HttpContextHelper = httpContextHelper;
            _TokenServices = tokenServices;
            _TimesheetServices = timesheetServices;
            _ClassServices = classServices;
            var authHeader = _HttpContextHelper.GetHeader("Authorization");
            _AuthToken = !string.IsNullOrEmpty(authHeader) ? _TokenServices.GetInfoFromToken(authHeader) : null;
        }

        public List<StatisticClass>? GetStatisticClass()
        {
            var timesheets = _TimesheetServices.GetAll(string.Empty, -1, -1, out _);
            var classInSemester = _ClassServices.GetClassInSemester(string.Empty, -1, -1, out _);

            // Gom tất cả studentId
            var allStudentIds = timesheets.SelectMany(t => t.StudentsId).Distinct().ToList();
            var studentDict = _Student.ListBy(s => allStudentIds.Contains(s.Id)).ToDictionary(s => s.Id);

            // Gom nhóm Timesheet theo ClassId và tính số lần xuất hiện của mỗi student
            var timesheetByClass = timesheets
                .GroupBy(t => t.ClassId)
                .ToDictionary(
                    g => g.Key,
                    g => g.SelectMany(t => t.StudentsId)
                          .GroupBy(id => id)
                          .ToDictionary(g2 => g2.Key, g2 => g2.Count())
                );

            // Duyệt từng lớp và tạo thống kê
            return classInSemester.Select(classItem =>
            {
                timesheetByClass.TryGetValue(classItem.Id, out var studentCountMap);

                var studentClasses = studentCountMap?
                    .Where(kvp => studentDict.ContainsKey(kvp.Key))
                    .Select(kvp =>
                    {
                        var student = studentDict[kvp.Key];
                        return new StudentClass
                        {
                            StudentName = $"{student.LastName} {student.FirstName}",
                            NumberTimesheet = kvp.Value
                        };
                    })
                    .ToList() ?? new List<StudentClass>();

                return new StatisticClass
                {
                    ClassName = classItem.Name,
                    StudentClasses = studentClasses
                };
            }).ToList();
        }

        public StatisticStudentTimesheet GetStatisticInfo()
        {
            long SemesterId = _AuthToken?.SemesterId ?? -100;
            var TimeSheetSemester = _TimesheetServices.GetAll(string.Empty, -1, -1, out _);
            var allStudentIds = TimeSheetSemester.SelectMany(t => t.StudentsId).Distinct().ToList();

            // Find the student with the most appearances in TimeSheetSemester
            var topStudentId = TimeSheetSemester
                .SelectMany(t => t.StudentsId)
                .GroupBy(id => id)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key;

            var topStudent = _Student.Find(f => f.Id == topStudentId);

            return new StatisticStudentTimesheet
            {
                NumberStudent = _User.All().Count(),
                NumberTimesheet = TimeSheetSemester.Count(),
                TopTimesheetStudentName = topStudent != null ? $"{topStudent.LastName} {topStudent.FirstName}" : string.Empty,
            };
        }
        public StatisticClassSalary GetStatisticInfoSalary()
        {          
            var _Timesheet = _TimesheetServices.GetAll(string.Empty, -1, -1, out _);
            var _Class = _ClassServices.GetClassInSemester(string.Empty, -1, -1, out _);

            var SalaryInfoStudent = new List<SalaryInfoStudent>();
            foreach (var item in _Timesheet)
            {
                List<StudentResponse> students = _Student.ListBy(l => item.StudentsId.Contains(l.Id))
                    .Select(s => new StudentResponse
                    {
                        Id = s.Id,
                        MaSinhVien = s.MaSinhVien,
                        FirstName = s.FirstName,
                        LastName = s.LastName,
                        Class = s.Class,
                        PhoneNumber = s.PhoneNumber,
                        Email = s.Email,
                        Gender = s.Gender,
                        Dob = s.Dob
                    }).ToList();


                if (students != null && students.Count() > 0)
                {
                    double Salary = (60 / (students.Count())) * 1000;
                    foreach (var student in students)
                    {
                        var salaryInfo = SalaryInfoStudent.FirstOrDefault(s => s.CodeName == student.MaSinhVien);
                        if (salaryInfo != null)
                        {
                            salaryInfo.Day = salaryInfo.Day + 1;
                            salaryInfo.Salary = salaryInfo.Salary + Salary;
                        }
                        else
                        {
                            SalaryInfoStudent.Add(new SalaryInfoStudent
                            {
                                CodeName = student.MaSinhVien,
                                StudentName = $"{student.LastName} {student.FirstName}",
                                Day = 1,
                                Salary = Salary,
                            });
                        }      
                    }
                }
            }

            return new StatisticClassSalary()
            {
                ToltalSalary = _Timesheet.Count * 60000,
                SalaryInfoStudents = SalaryInfoStudent.OrderByDescending(s => s.Salary).ToList()
            };
        }
    }
}
