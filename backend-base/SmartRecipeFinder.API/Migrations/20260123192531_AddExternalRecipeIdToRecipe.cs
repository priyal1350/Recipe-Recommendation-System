using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartRecipeFinder.API.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalRecipeIdToRecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExternalRecipeId",
                table: "Recipes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalRecipeId",
                table: "Recipes");
        }
    }
}
