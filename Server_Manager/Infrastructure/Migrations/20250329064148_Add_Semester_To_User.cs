using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_Semester_To_User : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets");

            migrationBuilder.AddColumn<long>(
                name: "SemesterId",
                table: "Users",
                type: "bigint",
                nullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "StudentId",
                table: "Timesheets",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateTable(
                name: "TimesheetStudents",
                columns: table => new
                {
                    TimesheetId = table.Column<long>(type: "bigint", nullable: false),
                    StudentId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimesheetStudents", x => new { x.TimesheetId, x.StudentId });
                    table.ForeignKey(
                        name: "FK_TimesheetStudents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimesheetStudents_Timesheets_TimesheetId",
                        column: x => x.TimesheetId,
                        principalTable: "Timesheets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "SemesterId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Users_SemesterId",
                table: "Users",
                column: "SemesterId");

            migrationBuilder.CreateIndex(
                name: "IX_TimesheetStudents_StudentId",
                table: "TimesheetStudents",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Semesters_SemesterId",
                table: "Users",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Semesters_SemesterId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "TimesheetStudents");

            migrationBuilder.DropIndex(
                name: "IX_Users_SemesterId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SemesterId",
                table: "Users");

            migrationBuilder.AlterColumn<long>(
                name: "StudentId",
                table: "Timesheets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
