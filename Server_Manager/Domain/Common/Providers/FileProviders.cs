//using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Domain.Common.Providers
{
    public static class FileProviders
    {
        //public static string UploadFile(IFormFile file, IWebHostEnvironment environment, string folderName)
        //{
        //    if (file == null) return null;

        //    string uploadsFolder = Path.Combine(environment.WebRootPath, folderName);
        //    var nameFile = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        //    string filePath = Path.Combine(uploadsFolder, nameFile);
        //    using (var fileStream = new FileStream(filePath, FileMode.Create))
        //    {
        //        file.CopyTo(fileStream);
        //    }
        //    return "/" + folderName + "/" + nameFile;
        //}
    }
}
