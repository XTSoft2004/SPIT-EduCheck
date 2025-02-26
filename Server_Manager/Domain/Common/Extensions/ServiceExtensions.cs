using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddServicesFromAssembly(this IServiceCollection services, Assembly assembly, string interfaceNamespace)
        {
            //var allTypes = assembly.GetTypes();
            //foreach (var t in allTypes)
            //{
            //    Console.WriteLine($"Found Type: {t.FullName}");
            //}

            var types = assembly.GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract)
                    .Select(t => new
                    {
                    Interface = t.GetInterfaces().FirstOrDefault(i =>
                        i.Name == "I" + t.Name && i.Namespace != null && i.Namespace.StartsWith(interfaceNamespace)),
                    Implementation = t
                })
                .Where(t => t.Interface != null);

            foreach (var type in types)
            {
                services.AddScoped(type.Interface, type.Implementation);
                Console.WriteLine($"Interfaces Add: {type.Interface.FullName}");
            }
        }
    }
}
