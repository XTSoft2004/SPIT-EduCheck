using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UnSetNullStudentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -2L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 7, 34, 288, DateTimeKind.Local).AddTicks(4043));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 7, 34, 287, DateTimeKind.Local).AddTicks(1329));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 7, 34, 289, DateTimeKind.Local).AddTicks(997));

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -2L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 3, 4, 444, DateTimeKind.Local).AddTicks(2571));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 3, 4, 442, DateTimeKind.Local).AddTicks(6509));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: new DateTime(2025, 2, 26, 16, 3, 4, 444, DateTimeKind.Local).AddTicks(9286));

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
