using System.Text;
using System.Text.RegularExpressions;

namespace Domain.Common.Providers
{
    public static partial class StringUtils
    {

        /// <summary>
        /// Chuyển các ký tự Tiếng việt có dấu thành không dấu
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string ToUnSign(this string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, string.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }

        public static string GenerateNInterger(int n)
        {
            var rnd = new Random();
            string s = "";

            for (int i = 0; i < n; i++)
            {
                s += rnd.Next(0, 9).ToString();
            }

            return s;
        }
    }
}
