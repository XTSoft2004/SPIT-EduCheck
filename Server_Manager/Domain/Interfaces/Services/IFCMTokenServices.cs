using Domain.Common.Http;
using Domain.Model.Request.FCMToken;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IFCMTokenServices
    {
        Task<HttpResponse> RegisterFCMToken(FCMTokenRequest fcmTokenRequest);
        Task<HttpResponse> RemoveFCMToken(string username);
        Task<HttpResponse> SendNotification(NotificationRequest notificationRequest);
    }
}
