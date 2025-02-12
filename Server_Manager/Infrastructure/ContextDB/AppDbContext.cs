using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ContextDB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Class_Courses> ClassCourses { get; set; } = null!;
        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<Lecturer> Lecturers { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Semester> Semesters { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<TeachingSchedule> TeachingSchedules { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Thiết lập quan hệ giữa User và Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            // Thiết lập quan hệ giữa Class_Courses và Lecturer
            modelBuilder.Entity<Class_Courses>()
                .HasOne(c => c.Lecturers)
                .WithMany(l => l.Class_Courses)
                .HasForeignKey(c => c.LecturerId);

            modelBuilder.Entity<Role>().HasData(
                new Role()
                {
                    Id = -1,
                    DisplayName = "Admin",
                    CreatedBy = "System",
                    //CreatedDate = DateTime.UtcNow
                },
                new Role()
                {
                    Id = -2,
                    DisplayName = "User",
                    CreatedBy = "System",
                    //CreatedDate = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<User>().HasData(
                new User()
                {
                    Id = -1,
                    Username = "admin",
                    Password = "admin",
                    RoleId = -1, // Phải khớp với Role.Id = -1
                    CreatedBy = "System",
                    //CreatedDate = DateTime.UtcNow
                }
            );
        }
    }

}