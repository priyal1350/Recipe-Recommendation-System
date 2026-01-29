namespace SmartRecipeFinder.API.Models
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string AgeGroup { get; set; }
        public string DietPreference { get; set; }
    }

}
