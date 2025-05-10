using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ContextDB
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer("Data Source=192.168.1.50;Initial Catalog=SPIT_EduCheck;User ID=sa;Password=Xuantruong22122k4*;TrustServerCertificate=True;MultipleActiveResultSets=True");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
