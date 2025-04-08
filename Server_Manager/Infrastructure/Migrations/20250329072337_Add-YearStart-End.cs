using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddYearStartEnd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Year",
                table: "Semesters",
                newName: "YearStart");

            migrationBuilder.AddColumn<int>(
                name: "YearEnd",
                table: "Semesters",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "YearEnd",
                table: "Semesters");

            migrationBuilder.RenameColumn(
                name: "YearStart",
                table: "Semesters",
                newName: "Year");
        }
    }
}
