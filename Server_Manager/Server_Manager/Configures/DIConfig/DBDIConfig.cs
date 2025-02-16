//using Domain.Infrastructures;
//using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;
using Domain.Interfaces.Database;
using static Domain.Common.AppConstants;
using Infrastructure.ContextDB;

namespace WebApp.Configures.DIConfig
{
    public static class DBDIConfig
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            // Inject DbContext
            //services.AddDbContext<AppDbContext>(options =>
            //{
            //    //options.UseLazyLoadingProxies();
            //    options.UseSqlServer(configuration.GetConnectionString(ConfigKeys.CONNECTION_STRING));
            //});

            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //services.AddDatabaseDeveloperPageExceptionFilter();

            //services.AddIdentity<User, Role>().AddEntityFrameworkStores<AppDbContext>()
            //    .AddDefaultUI()
            //    .AddDefaultTokenProviders();

            // Inject UnitOfWork
            services.AddScoped<IUnitOfWork, UnitOfWork>();
        }
    }
}
