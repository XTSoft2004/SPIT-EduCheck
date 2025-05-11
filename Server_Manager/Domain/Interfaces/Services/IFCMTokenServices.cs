using Domain.Common.Http;
using Domain.Model.Request.FCMToken;
using Domain.Model.Request.Notification;
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
        Task<HttpResponse> RemoveFCMToken(FCMTokenRequest fCMTokenRemoveRequest);
        Task<HttpResponse> SendNotification(NotificationRequest notificationRequest);
    }
}
