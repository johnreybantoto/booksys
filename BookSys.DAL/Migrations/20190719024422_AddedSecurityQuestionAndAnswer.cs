using Microsoft.EntityFrameworkCore.Migrations;

namespace BookSys.DAL.Migrations
{
    public partial class AddedSecurityQuestionAndAnswer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Question",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Question",
                table: "Users");
        }
    }
}
