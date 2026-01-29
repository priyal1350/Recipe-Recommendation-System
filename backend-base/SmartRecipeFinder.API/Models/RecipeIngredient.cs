using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class RecipeIngredient
    {
        [Key]
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public string Quantity { get; set; }
    }

}
