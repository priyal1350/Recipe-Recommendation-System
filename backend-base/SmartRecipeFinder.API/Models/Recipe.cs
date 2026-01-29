using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRecipeFinder.API.Models
{
    public class Recipe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ✅ auto increment
        public int RecipeId { get; set; }

        // ✅ Spoonacular Recipe ID
        public int? ExternalRecipeId { get; set; }

        public string Title { get; set; }
        public string Category { get; set; }
        public string Difficulty { get; set; }
        public int CookingTime { get; set; }
        public bool IsVegan { get; set; }
        public bool IsGlutenFree { get; set; }

        public int? CreatedBy { get; set; }
        public User? CreatedByUser { get; set; }

        public NutritionInfo NutritionInfo { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<ShoppingList> ShoppingLists { get; set; }
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; }
    }
}
