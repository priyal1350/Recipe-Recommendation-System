using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string AgeGroup { get; set; }
        public string DietPreference { get; set; }

        public ICollection<Recipe>? Recipes { get; set; }
        public ICollection<Favorite>? Favorites { get; set; }
        public ICollection<ShoppingList>? ShoppingLists { get; set; }
        public ICollection<AISearchHistory>? AISearchHistories { get; set; }
        public ICollection<UserAllergy>? UserAllergies { get; set; }

    }

}
