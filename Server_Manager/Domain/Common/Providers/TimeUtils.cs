using System.Globalization;

namespace Domain.Common.Providers
{
    public static partial class TimeUtils
    {
        public static string DateToDay(DateTime dateValue)
        {
            return dateValue.ToString("dddd", new CultureInfo("vi-VN"));
        }
    }
}
