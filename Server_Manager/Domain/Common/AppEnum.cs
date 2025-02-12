using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Domain.Common
{
    public enum Degree
    {
        [Display(Name = "TS.")]
        TienSi,
        [Display(Name = "ThS.")]
        ThacSi,
        [Display(Name = "CN.")]
        CuNhan
    }

    public enum AcademicRank
    {
        [Display(Name = "GS.")]
        GiaoSu,
        [Display(Name = "PGS.")]
        PhoGiaoSu
    }

    public enum TeachingPosition
    {
        [Display(Name = "Giảng viên trong khoa")]
        GiangVien,
        [Display(Name = "Thỉnh giảng")]
        ThinhGiang,
        [Display(Name = "Văn thư")]
        VanThu
    }

    public enum ApproveOpinion
    {
        [Display(Name = "Chưa được duyệt")]
        NotApproved,
        [Display(Name = "Đã duyệt")]
        Approved,
        [Display(Name = "Từ chối")]
        Rejected
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
