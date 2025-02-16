//using Domain.Helper;
using Domain.Interfaces.Helper;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
//using Domain.Models.Mails;
using Domain.Services;
using NetCore.AutoRegisterDi;
using Domain.Interfaces.Logging;
using Domain.Logging;
using static Domain.Common.AppConstants;
using Infrastructure.ContextDB.Repositories;

namespace WebApp.Configures.DIConfig
{
    public static class CommonDIConfig
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            // Inject Services
            services
            .RegisterAssemblyPublicNonGenericClasses(DIAssemblies.AssembliesToScan)
                .Where(t => t.Name.EndsWith("Services"))
                .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

            // Inject Repositories
            services
            .RegisterAssemblyPublicNonGenericClasses(DIAssemblies.AssembliesToScan)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

            // Inject Helpers
            services
            .RegisterAssemblyPublicNonGenericClasses(DIAssemblies.AssembliesToScan)
                .Where(t => t.Name.EndsWith("Helper"))
                .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

            services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
           

            // Inject AutoMapper
            services.AddAutoMapper(DIAssemblies.AssembliesToScan);

            // Inject Mail Helpers
            //services.Configure<SmtpSettings>(configuration.GetSection(ConfigKeys.SMTP_SETTINGS));
            //services.AddScoped<IMailHelper, MailHelper>();
            //services.AddScoped<IMailBodyGenerator, MailBodyGenerator>();

            services.AddScoped<IAppLogger, AppLogger>();
        }

    }
}
