namespace SmartRecipeFinder.API.Models.DTOs
{
    public class AddShoppingItemRequest
    {
        public int UserId { get; set; }
        public string IngredientName { get; set; }
        public string Quantity { get; set; }
    }
}
