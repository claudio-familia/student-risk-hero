using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentriskhero.Migrations
{
    /// <inheritdoc />
    public partial class DirectorTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Firstname",
                table: "Directors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Directors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Lastname",
                table: "Directors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Directors",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Firstname",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "Lastname",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Directors");
        }
    }
}
