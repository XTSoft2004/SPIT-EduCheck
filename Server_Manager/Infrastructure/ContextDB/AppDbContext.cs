using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.ContextDB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet cho các thực thể
        public DbSet<Student> Students { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Timesheet> Timesheets { get; set; }

        // DbSet cho các mối quan hệ
        public DbSet<Class_Student> ClassStudents { get; set; }
        public DbSet<Class_Course> ClassCourses { get; set; }
        public DbSet<Class_Timesheet> ClassTimesheets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
               .HasOne(u => u.Role)       // Một User có một Role
               .WithMany(r => r.Users)     // Một Role có nhiều User
               .HasForeignKey(u => u.RoleId)  // User có khóa ngoại trỏ đến Role
               .OnDelete(DeleteBehavior.Restrict); // Khi Role bị xóa, User không bị xóa

            #region Mối quan hệ giữa User và Student
            modelBuilder.Entity<User>()
                .HasOne(u => u.Student)
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.UserId) // Đặt khóa ngoại ở Student
                .OnDelete(DeleteBehavior.SetNull); // Khi User bị xóa, UserId trong Student thành NULL

            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne(u => u.Student)
                .HasForeignKey<User>(u => u.StudentId) // Đặt khóa ngoại ở User
                .OnDelete(DeleteBehavior.SetNull); // Khi Student bị xóa, StudentId trong User thành NULL
            #endregion

            modelBuilder.Entity<Course>()
                .HasOne(c => c.Semester)   // Một Semester có nhiều Course
                .WithMany(s => s.Courses)   // Một Course chỉ thuộc về một Semester
                .HasForeignKey(u => u.SemesterId) // Course có khóa ngoại trỏ đến Semester
                .OnDelete(DeleteBehavior.SetNull); // Khi Semester bị xóa, Course cũng bị xóa (tuỳ chọn)

            modelBuilder.Entity<Class>()
                .HasOne(c => c.Lecturer)
                .WithMany(l => l.Class)
                .HasForeignKey(c => c.LecturerId)
                .OnDelete(DeleteBehavior.SetNull); // Khi Lecturer bị xóa, Class sẽ trở về null

            modelBuilder.Entity<Class_Student>()
                .HasKey(cs => new { cs.ClassId, cs.StudentId }); // Khóa chính kết hợp  

            modelBuilder.Entity<Class_Timesheet>()
                .HasKey(cs => new { cs.ClassId, cs.TimesheetId }); // Khóa chính kết hợp

            modelBuilder.Entity<Class_Course>()
                .HasKey(cs => new { cs.ClassId, cs.CourseId }); // Khóa chính kết hợp

            // Seed dữ liệu cho Role
            var roleValues = Enum.GetValues(typeof(Role_Enum)).Cast<Role_Enum>().ToArray();
            var roles = roleValues
                .Select((role, index) => new Role
                {
                    Id = -(index + 1), // Sử dụng ID âm cho dữ liệu seed
                    DisplayName = role.GetEnumDisplayName(),
                    CreatedBy = "System"
                })
                .ToArray();

            modelBuilder.Entity<Role>().HasData(roles);

            // Seed dữ liệu cho User
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = -1,
                    Username = "admin",
                    Password = "admin", // Cần mã hóa mật khẩu trong môi trường sản xuất
                    RoleId = -1, // Phải khớp với Role.Id = -1
                    CreatedBy = "System",
                    // CreatedDate = DateTime.UtcNow // Bỏ chú thích nếu cần
                }
            );
        }
    }
}