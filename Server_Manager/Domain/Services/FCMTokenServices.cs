using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.FCMToken;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Domain.Interfaces.Common;
using Domain.Model.Response.Auth;
using static Google.Apis.Requests.BatchRequest;
using Domain.Model.Request.Notification;

namespace Domain.Services
{
    public class FCMTokenServices : BaseService, IFCMTokenServices
    {
        private readonly IRepositoryBase<FCMToken> _repository;
        private readonly IRepositoryBase<User> _user;
        private readonly ITokenServices _TokenServices;
        private readonly IHttpContextHelper _HttpContextHelper;
        private AuthToken? _AuthToken;
        public FCMTokenServices(IRepositoryBase<FCMToken> repository, IRepositoryBase<User> user, ITokenServices tokenServices, IHttpContextHelper httpContextHelper)
        {
            _repository = repository;
            _user = user;
            _TokenServices = tokenServices;
            _HttpContextHelper = httpContextHelper;
            var authHeader = _HttpContextHelper.GetHeader("Authorization");
            _AuthToken = !string.IsNullOrEmpty(authHeader) ? _TokenServices.GetInfoFromToken(authHeader) : null;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var credential = await GoogleCredential
                .FromFileAsync("D:\\Learn_HUSC\\C#\\SPIT-EduCheck\\Server_Manager\\Domain\\chamcongclb-service-account.json", CancellationToken.None);

            var scoped = credential.CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

            var token = await scoped.UnderlyingCredential.GetAccessTokenForRequestAsync();
            return token ?? string.Empty;
        }

        public async Task<HttpResponse> RegisterFCMToken(FCMTokenRequest fcmTokenRequest)
        {
            var user = _user.Find(f => f.Id == _AuthToken!.Id);
            if (user == null)
                return HttpResponse.Error("Không tìm thấy người dùng.", System.Net.HttpStatusCode.NotFound);

            var fcmToken = _repository.Find(f => f.Id == _AuthToken!.Id && f.AccessToken == fcmTokenRequest.AccessToken);
            if(fcmToken == null)
            {
                var newFCMToken = new FCMToken()
                {
                    AccessToken = fcmTokenRequest.AccessToken,
                    StudentId = _AuthToken!.Id,
                    CreatedDate = DateTime.Now
                };
                _repository.Insert(newFCMToken);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Đăng ký FCM Token thành công.");
            }
            else
                return HttpResponse.Error("Đã có đẵng kí FCM Token này rồi!", System.Net.HttpStatusCode.BadRequest);
        }

        public async Task<HttpResponse> RemoveFCMToken(FCMTokenRequest fCMTokenRemoveRequest)
        {
            var fcmToken = _repository.Find(f => f.Id == _AuthToken!.Id && f.AccessToken == fCMTokenRemoveRequest.AccessToken);
            if (fcmToken == null)
                return HttpResponse.Error("Không tìm thấy FCM Token.", System.Net.HttpStatusCode.NotFound);
            else
            {
                _repository.Delete(fcmToken);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Xóa FCM Token thành công.");
            }
        }

        private readonly string _serverKey = "TKO8mQrJNZkaV0ufOL0Y5hbl1L2zKvLmVrAUnVRzlXA";
        private readonly string _fcmUrl = "https://fcm.googleapis.com/fcm/send";

        public async Task<HttpResponse> SendNotification(NotificationRequest notificationRequest)
        {
            var fcmTokens = _repository.ListBy(f => f.Id == notificationRequest.StudentId).ToList();
            if (fcmTokens == null)
                return HttpResponse.Error("Không tìm thấy FCM Token.", System.Net.HttpStatusCode.NotFound);

            int numberNoti = 0;
            foreach(var fcmToken in fcmTokens)
            {
                var token = await GetAccessTokenAsync();

                var message = new
                {
                    message = new
                    {
                        token = fcmToken.AccessToken,
                        notification = new
                        {
                            title = notificationRequest.Title,
                            body = notificationRequest.Body
                        }
                    }
                };

                using var client = new HttpClient();

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");

                var json = JsonSerializer.Serialize(message);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://fcm.googleapis.com/v1/projects/chamcongclb-spit/messages:send", content);
                if (response.IsSuccessStatusCode)
                    numberNoti += 1;
            }
            if (numberNoti != 0)
            {
                return HttpResponse.OK(message: $"Gửi {numberNoti} thông báo thành công.");
            }
            else
            {
                return HttpResponse.Error("Gửi thông báo thất bại");
            }
        }
    }
}
