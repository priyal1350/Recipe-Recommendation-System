using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class Ingredient
    {
        [Key]
        public int IngredientId { get; set; }
        public string Name { get; set; }

        public ICollection<RecipeIngredient> RecipeIngredients { get; set; }
        public ICollection<IngredientAllergy>? IngredientAllergies { get; set; }

    }

}
