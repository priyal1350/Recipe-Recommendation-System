namespace SmartRecipeFinder.API.Models
{
    public class AIRequest
    {
        public string Ingredients { get; set; }
        public string Diet { get; set; }
        public string Allergies { get; set; }
        public string AgeGroup { get; set; }
    }
}
