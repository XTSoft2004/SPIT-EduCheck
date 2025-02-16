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
    public static class EnumExtensions
    {
        public static string GetEnumDisplayName<T>(this T enumType)
        {
            return enumType.GetType().GetMember(enumType.ToString())
                           .First()
                           .GetCustomAttribute<DisplayAttribute>()
                           .Name;
        }
    }
}
