using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Domain.Common
{
    public enum Role_Enum
    {
        [Display(Name = "Admin")]
        Admin,
        [Display(Name = "User")]
        User,
    }
    public enum Time_Enum
    {
        [Display(Name = "Sáng")]
        Sang,
        [Display(Name = "Chiều")]
        Chieu,
        [Display(Name = "Tối")]
        Toi,
    }
    public enum StatusTimesheet_Enum
    {
        [Display(Name = "Đã duyệt")]
        Approved,
        [Display(Name = "Không duyệt")]
        Rejected,
        [Display(Name = "Đang chờ duyệt")]
        Pending,
    }
    public static class EnumExtensions
    {
        public static string GetEnumDisplayName<T>(this T enumType)
        {
            return enumType.GetType().GetMember(enumType.ToString())
                           .First()
                           .GetCustomAttribute<DisplayAttribute>()
                           .Name;
        }
        public static string GetDisplayName(Enum value)
        {
            return value.GetType()
                        .GetField(value.ToString())
                        ?.GetCustomAttribute<DisplayAttribute>()
                        ?.Name ?? value.ToString();
        }
        public static bool IsValidDisplayName(string displayName, Type enumType)
        {
            return Enum.GetValues(enumType).Cast<Enum>().Any(e => GetDisplayName(e) == displayName);
        }
    }
}
