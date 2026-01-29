using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class ShoppingList
    {
        [Key]
        public int ShoppingListId { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int? RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public string IngredientName { get; set; }
        public string Quantity { get; set; }
    }

}
