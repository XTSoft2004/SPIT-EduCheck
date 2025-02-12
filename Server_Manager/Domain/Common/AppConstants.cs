namespace Domain.Common
{
    public struct AppConstants
    {
        public struct ConfigKeys
        {
            public const string SMTP_SETTINGS = "SmtpSettings";
            public const string CONNECTION_STRING = "DefaultConnection";
        }

        public struct DefaultAttribute
        {
            public const string PASSWORD = "12345";
            public const string MALE = "true";
            public const string FEMALE = "false";
            public const string CONTENT_IMAGE_PATH = "images/ContentImage";
            public const string DOCUMENT_PATH = "Documents";
            public const string DEFAULT_AVATAR = "/assets/images/DefaultAvatar.jpg";
        }

        public struct ApplicationRoles
        {
            public const string POST = "Post";
            public const string DATA = "Data";
            public const string CALENDAR = "Calendar";
            public const string DOCUMENT = "Document";
            public const string DONATION = "Donation";
            public const string YEAR30 = "Year30";
        }

        public struct AuthenticationSchemes
        {
            public const string ADMIN = "Admin";
            public const string USER = "User";
        }

        public struct UserPosition
        {
            public const string TRUONG_KHOA = "TruongKhoa";
            public const string PHO_KHOA = "PhoKhoa";
            public const string TRO_LY = "TroLy";
            public const string TRUONG_BO_MON = "TruongBoMon";
            public const string PHO_BO_MON = "PhoBoMon";
        }

        public struct DefaultString
        {
            public const string INVALID_MODEL = "Các thông tin nhập vào không hợp lệ hoặc chưa đầy đủ.";
        }
    }
}
