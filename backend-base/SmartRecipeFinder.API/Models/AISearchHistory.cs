using System.ComponentModel.DataAnnotations;

namespace SmartRecipeFinder.API.Models
{
    public class AISearchHistory
    {
        [Key]
        public int SearchId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public string UserQuery { get; set; }
        public string GeneratedSummary { get; set; }
        public DateTime SearchDate { get; set; }
    }

}
