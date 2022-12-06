using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentriskhero.Migrations
{
    /// <inheritdoc />
    public partial class CourseId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CourseId",
                table: "AssignmentStudents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssignmentStudents_CourseId",
                table: "AssignmentStudents",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_AssignmentStudents_Assignments_CourseId",
                table: "AssignmentStudents",
                column: "CourseId",
                principalTable: "Assignments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssignmentStudents_Assignments_CourseId",
                table: "AssignmentStudents");

            migrationBuilder.DropIndex(
                name: "IX_AssignmentStudents_CourseId",
                table: "AssignmentStudents");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "AssignmentStudents");
        }
    }
}
