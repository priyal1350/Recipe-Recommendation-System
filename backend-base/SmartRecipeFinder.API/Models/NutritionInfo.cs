using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class NutritionInfo
    {
        [Key]
        public int NutritionId { get; set; }
        public int RecipeId { get; set; }

        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fats { get; set; }
        public int Sugar { get; set; }
        public int Fiber { get; set; }

        public Recipe Recipe { get; set; }
    }

}
