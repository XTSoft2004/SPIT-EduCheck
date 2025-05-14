using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Common.Http;
using Domain.Model.Request.Notification;
using Domain.Model.Response.Notification;

namespace Domain.Interfaces.Services
{
    public interface INotificationServices
    {
        Task<HttpResponse> CreateNotification(NotificationRequest notificationRequest);
        Task<HttpResponse> DeleteNotification(long id);
        Task<List<NotificationResponse>> GetNotificationByStudentId();
        Task<HttpResponse> ActiveNotification(long ClassId, long StudentId);
        Task<HttpResponse> ReadNotification(long NotificationId);
    }
}
