namespace SmartRecipeFinder.API.Models
{
    public class IngredientAllergy
    {
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public int AllergyId { get; set; }
        public Allergy Allergy { get; set; }
    }
}
