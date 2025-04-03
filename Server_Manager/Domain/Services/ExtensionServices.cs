using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Class;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;

namespace Domain.Services
{
    public class ExtensionServices : BaseService, IExtensionServices
    {
        private readonly IRepositoryBase<User> _User;
        private readonly IRepositoryBase<Semester> _Semester;
        public async Task<HttpResponse> CreateAccountByStudentId(List<string> studentsMSV)
        {
            if (studentsMSV == null || studentsMSV.Count == 0)
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);
            var _userAll = _User.All();
            int success = 0;
            foreach (var studentMSV in studentsMSV)
            {
                var _user = _userAll.Where(f => f.Username == studentMSV).FirstOrDefault();
                if (_user != null)
                    continue;
                User user = new User()
                {
                    Username = studentMSV,
                    Password = "123456",
                    RoleId = -1,
                    CreatedDate = DateTime.Now,
                    Semester = GetSemesterNow(),
                };
                _User.Insert(user);
                success++;
            }
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: $"Tạo tài khoản {success} tài khoản thành công.");
        }
        private Semester GetSemesterNow()
        {
            int yearNow = DateTime.Now.Year;
            int monthNow = DateTime.Now.Month;
            int semesterNow;
            int yearStart, yearEnd;

            if (monthNow >= 9 && monthNow <= 12)
            {
                semesterNow = 1;
                yearStart = yearNow;
                yearEnd = yearNow + 1;
            }
            else if (monthNow >= 1 && monthNow <= 5)
            {
                semesterNow = 2;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }
            else // Từ tháng 6 đến đầu tháng 9
            {
                semesterNow = 3;
                yearStart = yearNow - 1;
                yearEnd = yearNow;
            }

            var semester = _Semester.Find(f => f.YearStart == yearStart
                && f.YearEnd == yearEnd
                && f.Semesters_Number == semesterNow);

            return semester;
        }
        public async Task<HttpResponse> ImportClass(string pathFile)
        {
            if (string.IsNullOrEmpty(pathFile))
                return HttpResponse.Error("Có lỗi xảy ra.", System.Net.HttpStatusCode.BadRequest);

            var readFile = File.ReadAllText(pathFile);
            var jsonData = JsonConvert.DeserializeObject<List<ClassRequest>>(readFile);

            // Đọc nội dung file và xử lý
            // ...
            return HttpResponse.OK(message: "Import lớp học thành công.");
        }

        public Task<HttpResponse> ImportStudents()
        {
            throw new NotImplementedException();
        }
    }
}
