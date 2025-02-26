using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDateTime_EntityBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -2L,
                column: "ModifiedDate",
                value: null);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: -1L,
                column: "ModifiedDate",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
