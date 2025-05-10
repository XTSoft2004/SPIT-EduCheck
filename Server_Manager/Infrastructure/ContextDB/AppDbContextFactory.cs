using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using System;
using DotNetEnv;

namespace Infrastructure.ContextDB
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Tải các biến môi trường từ file .env
            DotNetEnv.Env.Load();

            // Lấy các thông tin kết nối từ biến môi trường
            string dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
            string dbDatabase = Environment.GetEnvironmentVariable("DB_DATABASE");
            string dbUser = Environment.GetEnvironmentVariable("DB_USER");
            string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

            // Xây dựng chuỗi kết nối
            string connectionString = $"Data Source={dbServer};Initial Catalog={dbDatabase};User ID={dbUser};Password={dbPassword};TrustServerCertificate=True;MultipleActiveResultSets=True";

            // Tạo và trả về AppDbContext
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
