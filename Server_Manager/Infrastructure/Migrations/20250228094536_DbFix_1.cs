using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DbFix_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckIn",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "CheckOut",
                table: "Timesheets");

            migrationBuilder.AddColumn<long>(
                name: "ClassId",
                table: "Timesheets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "Timesheets",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Timesheets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "StudentId",
                table: "Timesheets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "TimeId",
                table: "Timesheets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_ClassId",
                table: "Timesheets",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_StudentId",
                table: "Timesheets",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_TimeId",
                table: "Timesheets",
                column: "TimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timesheets_Classes_ClassId",
                table: "Timesheets",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Timesheets_Times_TimeId",
                table: "Timesheets",
                column: "TimeId",
                principalTable: "Times",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timesheets_Classes_ClassId",
                table: "Timesheets");

            migrationBuilder.DropForeignKey(
                name: "FK_Timesheets_Students_StudentId",
                table: "Timesheets");

            migrationBuilder.DropForeignKey(
                name: "FK_Timesheets_Times_TimeId",
                table: "Timesheets");

            migrationBuilder.DropIndex(
                name: "IX_Timesheets_ClassId",
                table: "Timesheets");

            migrationBuilder.DropIndex(
                name: "IX_Timesheets_StudentId",
                table: "Timesheets");

            migrationBuilder.DropIndex(
                name: "IX_Timesheets_TimeId",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "TimeId",
                table: "Timesheets");

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckIn",
                table: "Timesheets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckOut",
                table: "Timesheets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
