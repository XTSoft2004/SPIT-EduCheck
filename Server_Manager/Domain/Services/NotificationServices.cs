using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Notification;
using Domain.Model.Response.Auth;
using Domain.Model.Response.Notification;

namespace Domain.Services
{
    public class NotificationServices : BaseService, INotificationServices
    {
        private readonly IRepositoryBase<Notification> _repository;
        private readonly IRepositoryBase<User> _userRepository;
        private readonly IRepositoryBase<Student> _studentRepository;
        private readonly IRepositoryBase<Class> _classRepository;
        private readonly IRepositoryBase<Class_Student> _classStudentRepository;
        private readonly ITokenServices _TokenServices;
        private readonly IHttpContextHelper _HttpContextHelper;
        private AuthToken? _AuthToken;
        public NotificationServices(IRepositoryBase<Notification> repository, IRepositoryBase<Class_Student> classStudentRepository, IRepositoryBase<User> userRepository, IRepositoryBase<Student> studentRepository, IRepositoryBase<Class> classRepository, ITokenServices tokenServices, IHttpContextHelper httpContextHelper)
        {
            _repository = repository;
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _userRepository = userRepository;
            _TokenServices = tokenServices;
            _classStudentRepository = classStudentRepository;
            _HttpContextHelper = httpContextHelper;
            var authHeader = _HttpContextHelper.GetHeader("Authorization");
            _AuthToken = !string.IsNullOrEmpty(authHeader) ? _TokenServices.GetInfoFromToken(authHeader) : null;
        }

        public async Task<HttpResponse> CreateNotification(NotificationRequest notificationRequest)
        {
            var student = _studentRepository.Find(f => f.Id == notificationRequest.StudentId);
            if (student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);

            var notification = new Notification()
            {
                Student = student,
                Title = notificationRequest.Title,
                Body = notificationRequest.Body,
                CreatedDate = DateTime.Now,
            };
            _repository.Insert(notification);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Tạo thông báo thành công.");
        }
        
        public async Task<HttpResponse> DeleteNotification(long id)
        {
            var notification = _repository.Find(f => f.Id == id);
            if (notification == null)
                return HttpResponse.Error("Không tìm thấy thông báo.", System.Net.HttpStatusCode.NotFound);
            _repository.Delete(notification);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Xóa thông báo thành công.");
        }

        public async Task<List<NotificationResponse>> GetNotificationByStudentId()
        {
            var user = _userRepository.Find(f => f.Id == _AuthToken!.Id);
            if (user == null)
                return new List<NotificationResponse>();

            var student = _studentRepository.Find(f => f.User!.Id == user.Id);
            if(student == null)
                return new List<NotificationResponse>();

            // Lấy danh sách thông báo của sinh viên
            var notifications = _repository
                .ListBy(f => f.StudentId == student.Id)
                .OrderByDescending(n => n.CreatedDate)
                .Select(n => new NotificationResponse()
                {
                    Id = n.Id,
                    Title = n.Title,
                    Body = n.Body,
                    isRead = n.isRead,
                    DateTimeCreate = n.CreatedDate
                })
                .ToList();

            if (notifications == null || !notifications.Any())
                return new List<NotificationResponse>();

            return notifications;
        }

        public async Task<HttpResponse> ActiveNotification(long ClassId)
        {
            var @class = _classRepository.Find(f => f.Id == ClassId);
            if (@class == null)
                return HttpResponse.Error("Không tìm thấy lớp học.", System.Net.HttpStatusCode.NotFound);

            var student = _studentRepository.Find(f => f.Id == _AuthToken!.StudentId);
            if (student == null)
                return HttpResponse.Error("Không tìm thấy sinh viên.", System.Net.HttpStatusCode.NotFound);

            var classStudent = _classStudentRepository.Find(f => f.ClassId == ClassId && f.StudentId == _AuthToken!.StudentId);
            if (classStudent != null)
            {
                _classStudentRepository.Delete(classStudent);
                await UnitOfWork.CommitAsync();
                return HttpResponse.Error("Tắt thông báo cho lớp này!", System.Net.HttpStatusCode.BadRequest);
            }
            else
            {
                Class_Student _classStudent = new Class_Student()
                {
                    ClassId = ClassId,
                    StudentId = _AuthToken!.StudentId,
                    CreatedDate = DateTime.Now
                };
                _classStudentRepository.Insert(_classStudent);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: $"Bật thông báo cho lớp {@class.Name} thành công!");
            }      
        }

        public async Task<HttpResponse> ReadNotification(long NotificationId)
        {
            var notification = _repository.Find(f => f.Id == NotificationId);
            if (notification == null)
                return HttpResponse.Error(message: "Không tồn tại thông báo này!");

            notification.isRead = true;
            _repository.Update(notification);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Đọc thông báo thành công!");
        }
    }
}
