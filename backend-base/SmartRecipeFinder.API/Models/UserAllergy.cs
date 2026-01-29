namespace SmartRecipeFinder.API.Models
{
    public class UserAllergy
    {
        public int UserId { get; set; }
        public int AllergyId { get; set; }

        public Allergy Allergy { get; set; }
    }
}
