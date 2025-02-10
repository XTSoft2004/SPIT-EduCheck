using System.Text.RegularExpressions;

namespace Domain.Common.Providers
{
    public static partial class UrlUtils
    {
        /// <summary>
        /// Tự động generate URL từ tiêu đề bài viết
        /// </summary>
        /// <param name="title"></param>
        /// <returns></returns>
        public static string GenerateUrlTitle(string title)
        {
            title = $"{Regex.Replace(title.ToUnSign().ToLower(), "[^a-z0-9]+", "-")}-{DateTime.Now.Ticks}";
            title = title.Replace("--", "-");
            return title;
        }
    }
}
