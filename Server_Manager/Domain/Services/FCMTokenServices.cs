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

namespace Domain.Services
{
    public class FCMTokenServices : BaseService, IFCMTokenServices
    {
        private readonly IRepositoryBase<FCMToken> _repository;
        private readonly IRepositoryBase<User> _user;
        public FCMTokenServices(IRepositoryBase<FCMToken> repository, IRepositoryBase<User> user)
        {
            _repository = repository;
            _user = user;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var credential = await GoogleCredential
                .FromFileAsync("C:\\Users\\Administrator\\Desktop\\SPIT-EduCheck\\Server_Manager\\Domain\\chamcongclb-service-account.json", CancellationToken.None);

            var scoped = credential.CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

            var token = await scoped.UnderlyingCredential.GetAccessTokenForRequestAsync();
            return token ?? string.Empty;
        }

        public async Task<HttpResponse> RegisterFCMToken(FCMTokenRequest fcmTokenRequest)
        {
            var user = _user.Find(f => f.Username == fcmTokenRequest.Username);
            if (user == null)
                return HttpResponse.Error("Không tìm thấy người dùng.", System.Net.HttpStatusCode.NotFound);

            var fcmToken = _repository.Find(f => f.AccessToken == fcmTokenRequest.AccessToken);
            if(fcmToken != null)
            {
                fcmToken.Username = fcmTokenRequest.Username;
                _repository.Update(fcmToken);
            }
            else
            {
                var newFCMToken = new FCMToken()
                {
                    AccessToken = fcmTokenRequest.AccessToken,
                    Username = fcmTokenRequest.Username,
                };
                _repository.Insert(newFCMToken);
            }
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Đăng ký FCM Token thành công.");
        }

        public async Task<HttpResponse> RemoveFCMToken(string username)
        {
            var fcmToken = _repository.Find(f => f.Username == username);
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
            var fcmToken = _repository.Find(f => f.Username == notificationRequest.Username);
            if (fcmToken == null)
                return HttpResponse.Error("Không tìm thấy FCM Token.", System.Net.HttpStatusCode.NotFound);

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
            {
                return HttpResponse.OK(message: "Gửi thông báo thành công.");
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return HttpResponse.Error("Gửi thông báo thất bại: " + errorMessage, System.Net.HttpStatusCode.InternalServerError);
            }
        }
    }
}
