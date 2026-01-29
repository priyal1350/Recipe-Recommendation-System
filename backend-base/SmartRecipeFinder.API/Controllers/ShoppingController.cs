using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;
using SmartRecipeFinder.API.Models.DTOs;

namespace SmartRecipeFinder.API.Controllers
{
    [Authorize]
    [Route("api/shopping")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _apiKey;

        public ShoppingController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _apiKey = config["Spoonacular:ApiKey"];
        }

        // ✅ Get UserId from JWT
        private int GetUserId()
        {
            var userId = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("Invalid or missing JWT token");

            return int.Parse(userId);
        }

        // 🛒 Generate Shopping List
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateShoppingList([FromQuery] int recipeId)
        {
            int uid = GetUserId();

            var user = await _context.Users.FindAsync(uid);
            if (user == null)
                return BadRequest("Invalid user ❌");

            var client = new HttpClient();
            var url = $"https://api.spoonacular.com/recipes/{recipeId}/ingredientWidget.json?apiKey={_apiKey}";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return BadRequest("Failed to fetch ingredients");

            var data = await response.Content.ReadFromJsonAsync<SpoonacularIngredientResponse>();

            if (data?.ingredients == null || !data.ingredients.Any())
                return BadRequest("No ingredients found");

            // ✅ Check if recipe already exists using ExternalRecipeId
            var recipe = await _context.Recipes
                .FirstOrDefaultAsync(r => r.ExternalRecipeId == recipeId);

            if (recipe == null)
            {
                var detailsUrl = $"https://api.spoonacular.com/recipes/{recipeId}/information?apiKey={_apiKey}";
                var detailsResponse = await client.GetAsync(detailsUrl);

                if (!detailsResponse.IsSuccessStatusCode)
                    return BadRequest("Failed to fetch recipe details");

                var detailsJson = await detailsResponse.Content.ReadAsStringAsync();
                using var doc = System.Text.Json.JsonDocument.Parse(detailsJson);
                var root = doc.RootElement;

                var title = root.GetProperty("title").GetString();
                var cookingTime = root.GetProperty("readyInMinutes").GetInt32();
                var vegan = root.GetProperty("vegan").GetBoolean();
                var glutenFree = root.GetProperty("glutenFree").GetBoolean();

                string category = "External";
                if (root.TryGetProperty("dishTypes", out var dishTypes) && dishTypes.GetArrayLength() > 0)
                {
                    category = dishTypes[0].GetString();
                }

                recipe = new Recipe
                {
                    ExternalRecipeId = recipeId, // ✅ Spoonacular ID
                    Title = title,
                    Category = category,
                    CookingTime = cookingTime,
                    Difficulty = "API",
                    CreatedBy = uid,
                    IsVegan = vegan,
                    IsGlutenFree = glutenFree
                };

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync(); // ✅ DB generates RecipeId
            }

            // 🛒 Add shopping items using DB RecipeId
            foreach (var ing in data.ingredients)
            {
                _context.ShoppingLists.Add(new ShoppingList
                {
                    UserId = uid,
                    RecipeId = recipe.RecipeId, // ✅ DB ID (NOT Spoonacular ID)
                    IngredientName = ing.name,
                    Quantity = $"{ing.amount.metric.value} {ing.amount.metric.unit}"
                });
            }

            await _context.SaveChangesAsync();

            return Ok("Shopping list generated 🛒");
        }

        // ➕ Add Manual Item
        [HttpPost("add-manual")]
        public async Task<IActionResult> AddManualItem([FromBody] AddShoppingItemRequest req)
        {
            int uid = GetUserId();

            var item = new ShoppingList
            {
                UserId = uid,
                RecipeId = null,
                IngredientName = req.IngredientName,
                Quantity = req.Quantity
            };

            _context.ShoppingLists.Add(item);
            await _context.SaveChangesAsync();

            return Ok("Item added successfully 🛒");
        }

        // 📋 Get Shopping List
        [HttpGet("list")]
        public async Task<IActionResult> GetUserShoppingList()
        {
            int uid = GetUserId();

            var list = await _context.ShoppingLists
                .Where(s => s.UserId == uid)
                .Select(s => new
                {
                    id = s.ShoppingListId,
                    ingredient = s.IngredientName,
                    quantity = s.Quantity
                })
                .ToListAsync();

            return Ok(list);
        }

        // ❌ Delete Item
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteItem([FromQuery] int id)
        {
            int uid = GetUserId();

            var item = await _context.ShoppingLists
                .FirstOrDefaultAsync(x => x.ShoppingListId == id && x.UserId == uid);

            if (item == null)
                return NotFound("Item not found");

            _context.ShoppingLists.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Item removed");
        }

        // 🧹 Clear List
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearList()
        {
            int uid = GetUserId();

            var items = _context.ShoppingLists.Where(x => x.UserId == uid);
            _context.ShoppingLists.RemoveRange(items);
            await _context.SaveChangesAsync();

            return Ok("Shopping list cleared");
        }

        // 📄 Export PDF
        [HttpGet("export")]
        public async Task<IActionResult> ExportShoppingList()
        {
            int uid = GetUserId();

            var list = await _context.ShoppingLists
                .Where(x => x.UserId == uid)
                .ToListAsync();

            if (!list.Any())
                return BadRequest("No items found");

            using var ms = new MemoryStream();
            var doc = new Document();
            PdfWriter.GetInstance(doc, ms);

            doc.Open();
            doc.Add(new Paragraph("Smart Recipe Finder - Shopping List"));
            doc.Add(new Paragraph(" "));

            var table = new PdfPTable(2);
            table.AddCell("Ingredient");
            table.AddCell("Quantity");

            foreach (var item in list)
            {
                table.AddCell(item.IngredientName);
                table.AddCell(item.Quantity);
            }

            doc.Add(table);
            doc.Close();

            return File(ms.ToArray(), "application/pdf", "ShoppingList.pdf");
        }
    }
}
