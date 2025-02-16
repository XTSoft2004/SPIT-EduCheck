namespace Domain.Common
{
    public struct AppConstants
    {
        public struct ConfigKeys
        {
            public const string SMTP_SETTINGS = "SmtpSettings";
            public const string CONNECTION_STRING = "DefaultConnection";
        }
        public struct ConfigJWT
        {
            public const int ExpireToken = 60;
            public const int ExpireRefreshToken = 60;
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
        public struct AuthenticationSchemes
        {
            public const string ADMIN = "Admin";
            public const string USER = "User";
        }
        public struct DefaultString
        {
            public const string INVALID_MODEL = "Các thông tin nhập vào không hợp lệ hoặc chưa đầy đủ.";
        }
    }
}
