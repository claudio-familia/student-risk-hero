using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentriskhero.Migrations
{
    /// <inheritdoc />
    public partial class AddEvidenceColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "RiskProfileEvidences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "RiskProfileEvidences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "RiskProfileEvidences");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "RiskProfileEvidences");
        }
    }
}
