using Domain.Interfaces.Repositories;
using Infrastructure.ContextDB.Repositories;
using System.Reflection;

namespace WebApp.Configures
{
    public static class DIAssemblies
    {
        internal static Assembly[] AssembliesToScan = new Assembly[]
        {
            Assembly.GetExecutingAssembly(),
            Assembly.GetAssembly(typeof(DIAssemblies)),
            Assembly.GetAssembly(typeof(IRepositoryBase<>)),
            Assembly.GetAssembly(typeof(RepositoryBase<>)),
        };
    }
}
