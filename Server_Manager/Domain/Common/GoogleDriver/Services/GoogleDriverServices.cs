using Domain.Base.Services;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Interfaces.Services;
using HelperHttpClient;
using HelperHttpClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Services
{
    public class GoogleDriverSevices : BaseService, IGoogleDriverServices
    {
        private readonly RequestHttpClient _request = new RequestHttpClient();
        public async Task<UploadFileResponse> UploadFile(UploadFileRequest uploadFileRequest)
        {
            string accessToken = "";
            string folderId = "1wgJUXMO3gX1iO1IP_agCteEoR82s1IZm";

            string fileName = Path.GetFileName(uploadFileRequest.fileUpload.FileName);

            string metadataJson = $@"{{
                ""name"": ""{fileName}"",
                ""parents"": [""{folderId}""],
                ""mimeType"": ""image/jpeg""
            }}";

            string boundary = "===MyCustomBoundary===";

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var multipartContent = new MultipartContent("related", boundary);
            multipartContent.Add(new StringContent(metadataJson, Encoding.UTF8, "application/json"));
            using (var memoryStream = new MemoryStream())
            {
                await uploadFileRequest.fileUpload.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                multipartContent.Add(new ByteArrayContent(fileBytes)
                {
                    Headers = { ContentType = new MediaTypeHeaderValue("image/jpeg") }
                });
            }

            var response = await client.PostAsync(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                multipartContent
            );

            string responseText = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("✅ Upload thành công!");
                Console.WriteLine("📄 Response: " + responseText);

                var jsonData = JsonSerializer.Deserialize<UploadFileResponse>(responseText);
                return jsonData;
            }

            else
            {
                Console.WriteLine("❌ Upload thất bại:");
                Console.WriteLine(responseText);
                return null;
            }

        }
    }
}
