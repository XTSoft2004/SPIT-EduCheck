//using Domain.Infrastructures;
//using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;
using Domain.Interfaces.Database;
using static Domain.Common.AppConstants;
using Infrastructure.ContextDB;
using Domain.Interfaces.Services;
using Domain.Services;
using Domain.Common.Extensions;
using System.Reflection;
using Domain.Common.BackgroudServices;

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
            // Inject UnitOfWork
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            // Add Interfaces Automatic
            services.AddServicesFromAssembly(typeof(IStudentServices).Assembly, "Domain.Interfaces");

            //services.AddDatabaseDeveloperPageExceptionFilter();

            //services.AddIdentity<User, Role>().AddEntityFrameworkStores<AppDbContext>()
            //    .AddDefaultUI()
            //    .AddDefaultTokenProviders();

        }
    }
}
