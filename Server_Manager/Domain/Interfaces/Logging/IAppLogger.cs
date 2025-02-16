namespace Domain.Interfaces.Logging
{
    public interface IAppLogger
    {
        void Info(string message, params object[] args);

        void Warning(string message, params object[] args);

        void Error(string message, params object[] args);

        void Info(Exception exception, params object[] args);

        void Warning(Exception exception, params object[] args);

        void Error(Exception exception, params object[] args);
    }
}
