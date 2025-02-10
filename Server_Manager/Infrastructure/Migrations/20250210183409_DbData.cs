using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DbData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassCourses_Courses_CourseID",
                table: "ClassCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassCourses_Lecturers_LecturerID",
                table: "ClassCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Semesters_SemesterID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachingSchedules_ClassCourses_Class_CoursesID",
                table: "TeachingSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachingSchedules_Students_StudentID",
                table: "TeachingSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "RoleID",
                table: "Users",
                newName: "RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                newName: "IX_Users_RoleId");

            migrationBuilder.RenameColumn(
                name: "StudentID",
                table: "TeachingSchedules",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "Class_CoursesID",
                table: "TeachingSchedules",
                newName: "Class_CoursesId");

            migrationBuilder.RenameIndex(
                name: "IX_TeachingSchedules_StudentID",
                table: "TeachingSchedules",
                newName: "IX_TeachingSchedules_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_TeachingSchedules_Class_CoursesID",
                table: "TeachingSchedules",
                newName: "IX_TeachingSchedules_Class_CoursesId");

            migrationBuilder.RenameColumn(
                name: "SemesterID",
                table: "Courses",
                newName: "SemesterId");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_SemesterID",
                table: "Courses",
                newName: "IX_Courses_SemesterId");

            migrationBuilder.RenameColumn(
                name: "LecturerID",
                table: "ClassCourses",
                newName: "LecturerId");

            migrationBuilder.RenameColumn(
                name: "CourseID",
                table: "ClassCourses",
                newName: "CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassCourses_LecturerID",
                table: "ClassCourses",
                newName: "IX_ClassCourses_LecturerId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassCourses_CourseID",
                table: "ClassCourses",
                newName: "IX_ClassCourses_CourseId");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "TeachingSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "TeachingSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Semesters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Semesters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Lecturers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Lecturers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ClassCourses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ClassCourses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedBy", "CreatedDate", "DisplayName", "ModifiedBy", "ModifiedDate" },
                values: new object[,]
                {
                    { -2L, "System", new DateTime(2025, 2, 10, 18, 34, 8, 976, DateTimeKind.Utc).AddTicks(2171), "User", null, null },
                    { -1L, "System", new DateTime(2025, 2, 10, 18, 34, 8, 976, DateTimeKind.Utc).AddTicks(2037), "Admin", null, null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedBy", "CreatedDate", "Dob", "Gender", "IsLocked", "ModifiedBy", "ModifiedDate", "Password", "RoleId", "Username" },
                values: new object[] { -1L, "System", new DateTime(2025, 2, 10, 18, 34, 8, 976, DateTimeKind.Utc).AddTicks(7027), null, null, false, null, null, "admin", -1L, "admin" });

            migrationBuilder.AddForeignKey(
                name: "FK_ClassCourses_Courses_CourseId",
                table: "ClassCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassCourses_Lecturers_LecturerId",
                table: "ClassCourses",
                column: "LecturerId",
                principalTable: "Lecturers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Semesters_SemesterId",
                table: "Courses",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeachingSchedules_ClassCourses_Class_CoursesId",
                table: "TeachingSchedules",
                column: "Class_CoursesId",
                principalTable: "ClassCourses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeachingSchedules_Students_StudentId",
                table: "TeachingSchedules",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassCourses_Courses_CourseId",
                table: "ClassCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassCourses_Lecturers_LecturerId",
                table: "ClassCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Semesters_SemesterId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachingSchedules_ClassCourses_Class_CoursesId",
                table: "TeachingSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_TeachingSchedules_Students_StudentId",
                table: "TeachingSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -2L);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -1L);

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "Users",
                newName: "RoleID");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                newName: "IX_Users_RoleID");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "TeachingSchedules",
                newName: "StudentID");

            migrationBuilder.RenameColumn(
                name: "Class_CoursesId",
                table: "TeachingSchedules",
                newName: "Class_CoursesID");

            migrationBuilder.RenameIndex(
                name: "IX_TeachingSchedules_StudentId",
                table: "TeachingSchedules",
                newName: "IX_TeachingSchedules_StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_TeachingSchedules_Class_CoursesId",
                table: "TeachingSchedules",
                newName: "IX_TeachingSchedules_Class_CoursesID");

            migrationBuilder.RenameColumn(
                name: "SemesterId",
                table: "Courses",
                newName: "SemesterID");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_SemesterId",
                table: "Courses",
                newName: "IX_Courses_SemesterID");

            migrationBuilder.RenameColumn(
                name: "LecturerId",
                table: "ClassCourses",
                newName: "LecturerID");

            migrationBuilder.RenameColumn(
                name: "CourseId",
                table: "ClassCourses",
                newName: "CourseID");

            migrationBuilder.RenameIndex(
                name: "IX_ClassCourses_LecturerId",
                table: "ClassCourses",
                newName: "IX_ClassCourses_LecturerID");

            migrationBuilder.RenameIndex(
                name: "IX_ClassCourses_CourseId",
                table: "ClassCourses",
                newName: "IX_ClassCourses_CourseID");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "TeachingSchedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "TeachingSchedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Semesters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Semesters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Lecturers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Lecturers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ClassCourses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ClassCourses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassCourses_Courses_CourseID",
                table: "ClassCourses",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassCourses_Lecturers_LecturerID",
                table: "ClassCourses",
                column: "LecturerID",
                principalTable: "Lecturers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Semesters_SemesterID",
                table: "Courses",
                column: "SemesterID",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeachingSchedules_ClassCourses_Class_CoursesID",
                table: "TeachingSchedules",
                column: "Class_CoursesID",
                principalTable: "ClassCourses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeachingSchedules_Students_StudentID",
                table: "TeachingSchedules",
                column: "StudentID",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users",
                column: "RoleID",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
