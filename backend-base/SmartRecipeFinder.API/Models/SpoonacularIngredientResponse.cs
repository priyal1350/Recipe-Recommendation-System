namespace SmartRecipeFinder.API.Models
{
    public class SpoonacularIngredientResponse
    {
        public List<SpoonacularIngredient> ingredients { get; set; }
    }

    public class SpoonacularIngredient
    {
        public string name { get; set; }
        public SpoonacularAmount amount { get; set; }
    }

    public class SpoonacularAmount
    {
        public SpoonacularMetric metric { get; set; }
    }

    public class SpoonacularMetric
    {
        public double value { get; set; }
        public string unit { get; set; }
    }

}
