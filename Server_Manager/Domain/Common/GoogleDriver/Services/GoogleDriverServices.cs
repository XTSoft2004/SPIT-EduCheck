using Domain.Base.Services;
using Domain.Common.GoogleDriver.Model;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Interfaces.Services;
using HelperHttpClient;
using HelperHttpClient.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Services
{
    public class GoogleDriverSevices : BaseService, IGoogleDriverServices
    {
        private readonly RequestHttpClient? _request;
        private readonly IConfiguration _config;
        public GoogleDriverSevices(IConfiguration configuration)
        {
            _request = new RequestHttpClient();
            _config = configuration;
        }
        public async Task<string> UploadImage(UploadFileRequest uploadFileRequest)
        {
            var uploadResponse = await UploadFile(uploadFileRequest);
            if (uploadResponse != null)
            {
                //string thumbnailLink = await PreviewFile(uploadResponse);
                string urlFile = $"https://drive.google.com/uc?export=view&id={uploadResponse.id}";
                return urlFile;
            }
            return string.Empty;
        }
        private async Task<UploadFileResponse> UploadFile(UploadFileRequest uploadFileRequest)
        {
            string accessToken = await GetAccessToken();
            string folderId = "1wgJUXMO3gX1iO1IP_agCteEoR82s1IZm";

            string fileName = Path.GetFileName(uploadFileRequest.fileUpload.FileName);

            string metadataJson = $@"{{
                ""name"": ""{uploadFileRequest.FileName}"",
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

                var jsonData = System.Text.Json.JsonSerializer.Deserialize<UploadFileResponse>(responseText);
                return jsonData;
            }

            else
            {
                Console.WriteLine("❌ Upload thất bại:");
                Console.WriteLine(responseText);
                return null;
            }
        }
        public async Task<string> GetAccessToken()
        {
            TokenInfoGoogleResponse InfoToken = await GetInfoToken(TokenDriverStore.Access_Token);

            if (InfoToken == null || (InfoToken != null && Convert.ToInt32(InfoToken.exp) <= DateTimeOffset.UtcNow.ToUnixTimeSeconds()))
            {
                var JsonData = new Dictionary<string, string>
                {
                    { "client_id", _config["GoogleInfo:client_id"] },
                    { "client_secret", _config["GoogleInfo:client_secret"] },
                    { "refresh_token", _config["GoogleInfo:refresh_token"] },
                    { "grant_type", "refresh_token" }
                };
                var response = await _request.PostAsync("https://oauth2.googleapis.com/token", JsonData);
                if (response.IsSuccessStatusCode)
                {
                    string access_token = Regex.Match(_request.Content, "\"access_token\": \"(.*?)\"").Groups[1].Value;
                    TokenDriverStore.Access_Token = access_token;
                    return access_token;
                }
            }
            return TokenDriverStore.Access_Token;
        }
        private async Task<TokenInfoGoogleResponse> GetInfoToken(string access_token)
        {
            if (string.IsNullOrEmpty(access_token))
                return null;
            _request.SetAuthentication(access_token);
            var response = await _request.GetAsync("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + access_token);
            if (response.IsSuccessStatusCode)
            {
                var jsonData = JsonConvert.DeserializeObject<TokenInfoGoogleResponse>(_request.Content);
                return jsonData;
            }
            else
            {
                return null;
            }
        }
        public async Task<string> PreviewFile(string fileId)
        {
            string accessToken = await GetAccessToken();
            var response = await _request.GetAsync($"https://www.googleapis.com/drive/v2/files/{fileId}");
            if (response.IsSuccessStatusCode)
            {
                string fileContent = _request.Content;
                var jsonData = JObject.Parse(fileContent);
                if (jsonData["thumbnailLink"] != null)
                {
                    string thumbnailLink = jsonData["thumbnailLink"].ToString();
                    return thumbnailLink;
                }
            }
            Console.WriteLine("❌ Lỗi khi lấy nội dung tệp tin:");
            Console.WriteLine(await response.Content.ReadAsStringAsync());
            return string.Empty;
        }
    }
}
