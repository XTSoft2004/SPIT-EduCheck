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
            optionsBuilder.UseSqlServer("Data Source=118.71.236.93;Initial Catalog=SPIT_EduCheck;User ID=sa;Password=Xuantruong23*;TrustServerCertificate=True;MultipleActiveResultSets=True");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
