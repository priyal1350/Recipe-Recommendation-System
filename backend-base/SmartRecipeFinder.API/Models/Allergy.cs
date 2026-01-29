using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class Allergy
    {
        [Key]
        public int AllergyId { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<IngredientAllergy> IngredientAllergies { get; set; }
        public ICollection<UserAllergy> UserAllergies { get; set; }
    }
}
