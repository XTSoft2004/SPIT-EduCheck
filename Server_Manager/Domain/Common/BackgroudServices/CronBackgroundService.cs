using System;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Google.Apis.Auth.OAuth2;
using System.Text.Json;
using Domain.Model.Response.Class;
using System.Net.WebSockets;
using Domain.Interfaces.Database;
using Domain.Model.Request.Notification;

namespace Domain.Common.BackgroudServices
{
    public class CronBackgroundService : BackgroundService
    {
        private readonly ILogger<CronBackgroundService>? _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        private bool _isRunning = false;

        public CronBackgroundService(
            ILogger<CronBackgroundService>? logger,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(1));
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await _time_Callback(null);
            }
        }
        public int DayOfWeek { get; set; } = 0;
        public List<ClassResponse> ClassDayofWeek { get; set; } = new List<ClassResponse>();
        int GetVietnamDayNumber(System.DayOfWeek day)
        {
            return day switch
            {
                System.DayOfWeek.Monday => 2,
                System.DayOfWeek.Tuesday => 3,
                System.DayOfWeek.Wednesday => 4,
                System.DayOfWeek.Thursday => 5,
                System.DayOfWeek.Friday => 6,
                System.DayOfWeek.Saturday => 7,
                System.DayOfWeek.Sunday => 8, // hoặc 1 nếu bạn muốn Chủ Nhật là đầu tuần
                _ => 0
            };
        }

        public async Task _time_Callback(object? state)
        {
            if (_isRunning) return;
            _isRunning = true;
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var classRepo = scope.ServiceProvider.GetRequiredService<IRepositoryBase<Class>>();
                var classStudentRepo = scope.ServiceProvider.GetRequiredService<IRepositoryBase<Class_Student>>();
                var fcmTokenRepo = scope.ServiceProvider.GetRequiredService<IRepositoryBase<FCMToken>>();
                var notificationRepo = scope.ServiceProvider.GetRequiredService<IRepositoryBase<Notification>>();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();   

                var vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
                PrintWithRandomColor($"Đang kiểm tra lúc {vietnamTime}"); // In ra thông báo với màu ngẫu nhiên

                // Lấy ra các lớp học trong ngày hôm hiện tại
                var DayOfWeekNow = GetVietnamDayNumber(vietnamTime.DayOfWeek);
                if (DayOfWeekNow != DayOfWeek)
                {
                    DayOfWeek = GetVietnamDayNumber(vietnamTime.DayOfWeek);
                    ClassDayofWeek = classRepo.ListBy(c => c.Day == DayOfWeekNow)
                        .Select(s => new ClassResponse
                        {
                            Id = s.Id,
                            Code = s.Code,
                            Name = s.Name,
                            TimeStart = s.TimeStart,
                            TimeEnd = s.TimeEnd,
                            Day = s.Day,
                            CourseId = s.CourseId,
                        })
                        .ToList();
                }

                // Lấy ra các lớp học sắp kết thúc trong vòng 30 phút
                var timeEndAfter = TimeOnly.FromDateTime(vietnamTime);
                var endingClasses = classRepo.ListBy(c => c.Day == DayOfWeek && c.TimeEnd.AddMinutes(-30) < timeEndAfter
                                                       && c.TimeEnd >= timeEndAfter)
                                              .ToList();

                // Lấy ra danh sách sinh viên trong các lớp học này
                var classIds = endingClasses.Select(c => c.Id).ToList();
                var classStudents = classStudentRepo.ListBy(cs => classIds.Contains(cs.ClassId))
                                                    .Select(cs => new { cs.Student, cs.Class })
                                                    .ToList();

                foreach (var entry in classStudents)
                {
                    // Kiểm tra xem lớp này đã thông báo trong hôm đó chưa
                    var classRemove = ClassDayofWeek.Where(w => w.Id == entry.Class.Id).FirstOrDefault();
                    if (classRemove != null)
                    {
                        // Nếu lớp học đã thông báo thì không gửi thông báo nữa
                        var TokenUser = fcmTokenRepo.ListBy(f => f.StudentId == entry.Student.Id).ToList();
                        foreach (var token in TokenUser)
                        {
                            var notificationRequest = new NotificationRequest
                            {
                                StudentId = entry.Student.Id,
                                Title = "Lớp học sắp kết thúc",
                                Body = $"Lớp {entry.Class.Name} của bạn sắp kết thúc, hãy nhớ chấm công nhé!",
                            };

                            bool isSend = await SendNotification(token.AccessToken, notificationRequest);
                            if(isSend)
                            {
                                PrintWithRandomColor($"Gửi thông báo đến {entry.Student.MaSinhVien} về lớp học {entry.Class.Name}"); // In ra thông báo với màu ngẫu nhiên
                                notificationRepo.Insert(new Notification
                                {
                                    Title = notificationRequest.Title,
                                    Body = notificationRequest.Body,
                                    StudentId = entry.Student.Id,
                                    CreatedDate = DateTime.Now,
                                });
                                
                                await unitOfWork.CommitAsync(); // Lưu thông báo vào cơ sở dữ liệu
                            }
                        }
                        
                        ClassDayofWeek.Remove(classRemove);
                        PrintWithRandomColor($"Lớp học {entry.Class.Name} đã được xóa khỏi danh sách lớp học trong ngày {DayOfWeekNow}"); // In ra thông báo với màu ngẫu nhiên
                    }
                    else
                        PrintWithRandomColor($"Không có lớp học nào hợp lệ");
                }
            }
            catch (Exception ex)
            {
                PrintWithRandomColor($"Lỗi khi kiểm tra lớp học sắp kết thúc: {ex.Message}"); // In ra thông báo lỗi với màu ngẫu nhiên
            }
            finally
            {
                _isRunning = false;
            }
        }

        public async Task<string> GetAccessTokenAsync()
        {
            string pathDomain = $"{AppContext.BaseDirectory}chamcongclb-service-account.json";
            var credential = await GoogleCredential
                .FromFileAsync(pathDomain, CancellationToken.None);

            var scoped = credential.CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

            var token = await scoped.UnderlyingCredential.GetAccessTokenForRequestAsync();
            return token ?? string.Empty;
        }

        public async Task<bool> SendNotification(string TokenUser ,NotificationRequest notificationRequest)
        {
            var token = await GetAccessTokenAsync();

            var message = new
            {
                message = new
                {
                    token = TokenUser,
                    notification = new
                    {
                        title = notificationRequest.Title,
                        body = notificationRequest.Body
                    }
                }
            };

            var json = JsonSerializer.Serialize(message);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");


            var response = await client.PostAsync(
                "https://fcm.googleapis.com/v1/projects/chamcongclb-spit/messages:send",
                content
            );

            if (response.IsSuccessStatusCode)
            {
                PrintWithRandomColor($"Gửi thông báo thành công đến {notificationRequest.StudentId}");
                return true;
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                PrintWithRandomColor($"Gửi thông báo thất bại đến {notificationRequest.StudentId}: {errorMessage}");
                return false;   
            }
        }
        public static void PrintWithRandomColor(string message)
        {
            var random = new Random();
            // Lấy một màu ngẫu nhiên từ ConsoleColor
            var colors = (ConsoleColor[])Enum.GetValues(typeof(ConsoleColor));
            var randomColor = colors[random.Next(colors.Length)];

            var originalColor = Console.ForegroundColor; // Lưu lại màu sắc gốc của console
            Console.ForegroundColor = randomColor; // Đặt màu sắc ngẫu nhiên
            Console.WriteLine(message); // In thông báo
            Console.ForegroundColor = originalColor; // Khôi phục lại màu sắc gốc
        }
    }
}
