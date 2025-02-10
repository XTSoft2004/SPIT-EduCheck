using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ContextDB
{
    internal class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Class_Courses> ClassCourses { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<TeachingSchedule> TeachingSchedules { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Thiết lập quan hệ giữa User và Role
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleID);

            // Thiết lập quan hệ giữa Class_Courses và Lecturer
            modelBuilder.Entity<Class_Courses>()
                .HasOne(c => c.Lecturers)
                .WithMany(l => l.Class_Courses)
                .HasForeignKey(c => c.LecturerID);

            // Seed data for Roles
            modelBuilder.Entity<Role>().HasData(
                new Role() { DisplayName = "Admin" },
                new Role() { DisplayName = "User" }
            );

            modelBuilder.Entity<User>().HasData(
                new User()
                {
                    Username = "admin",
                    Password = "admin",
                    Role = new Role() { DisplayName = "Admin" }
            });
        }
    }

}