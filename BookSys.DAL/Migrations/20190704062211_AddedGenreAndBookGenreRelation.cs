using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BookSys.DAL.Migrations
{
    public partial class AddedGenreAndBookGenreRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "GenreID",
                table: "Books",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MyGuid = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Books_GenreID",
                table: "Books",
                column: "GenreID");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Genres_GenreID",
                table: "Books",
                column: "GenreID",
                principalTable: "Genres",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Genres_GenreID",
                table: "Books");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropIndex(
                name: "IX_Books_GenreID",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "GenreID",
                table: "Books");
        }
    }
}
