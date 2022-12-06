using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentriskhero.Migrations
{
    /// <inheritdoc />
    public partial class StudentGenderColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Students_Course",
                table: "Students",
                column: "Course");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Courses_Course",
                table: "Students",
                column: "Course",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Courses_Course",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_Course",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Students");
        }
    }
}
