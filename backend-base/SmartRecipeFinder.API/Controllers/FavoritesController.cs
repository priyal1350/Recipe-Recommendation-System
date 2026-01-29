using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;
using System.Text.Json;
using System.Security.Claims;

namespace SmartRecipeFinder.API.Controllers
{
    [Authorize]
    [Route("api/user")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string? _apiKey;

        public FavoritesController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _apiKey = config["Spoonacular:ApiKey"];
        }

        // ✅ Helper Method to Get UserId from JWT
        private int GetUserId()
        {
            var userId = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("Invalid token");

            return int.Parse(userId);
        }

        // ❤️ Add Favorite
        [HttpPost("addFavorite")]
        public async Task<IActionResult> AddFavorite([FromQuery] int recipeId)
        {
            int uid = GetUserId();

            // ✅ Find recipe by ExternalRecipeId (not RecipeId)
            var recipe = await _context.Recipes
                .FirstOrDefaultAsync(r => r.ExternalRecipeId == recipeId);

            if (recipe == null)
            {
                var http = new HttpClient();

                var res = await http.GetFromJsonAsync<JsonElement>(
                    $"https://api.spoonacular.com/recipes/{recipeId}/information?apiKey={_apiKey}"
                );

                string category = "External";
                if (res.TryGetProperty("dishTypes", out var dishTypes) && dishTypes.GetArrayLength() > 0)
                {
                    category = dishTypes[0].GetString();
                }

                recipe = new Recipe
                {
                    ExternalRecipeId = res.GetProperty("id").GetInt32(), // ✅ API id stored here
                    Title = res.GetProperty("title").GetString(),
                    Category = category,
                    CookingTime = res.GetProperty("readyInMinutes").GetInt32(),
                    Difficulty = "Medium",
                    IsVegan = res.GetProperty("vegan").GetBoolean(),
                    IsGlutenFree = res.GetProperty("glutenFree").GetBoolean()
                };

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();
            }

            // ✅ Check favorite using DB RecipeId
            bool exists = await _context.Favorites.AnyAsync(f => f.UserId == uid && f.RecipeId == recipe.RecipeId);
            if (exists)
                return BadRequest("Already in favorites ❤️");

            _context.Favorites.Add(new Favorite
            {
                UserId = uid,
                RecipeId = recipe.RecipeId // ✅ DB id
            });

            await _context.SaveChangesAsync();

            return Ok("Added to favorites ❤️");
        }


        // 📌 Get User Favorites
        [HttpGet("favorites")]
        public async Task<IActionResult> GetUserFavorites()
        {
            int uid = GetUserId();

            var favorites = await _context.Favorites
                .Where(f => f.UserId == uid)
                .Include(f => f.Recipe)
                .Select(f => new
                {
                    id = f.Recipe.ExternalRecipeId,
                    title = f.Recipe.Title,
                    category = f.Recipe.Category,
                    cookingTime = f.Recipe.CookingTime,
                    isVegan = f.Recipe.IsVegan,
                    isGlutenFree = f.Recipe.IsGlutenFree,

                    // ✅ ADD IMAGE URL
                    image = $"https://spoonacular.com/recipeImages/{f.Recipe.ExternalRecipeId}-312x231.jpg"
                })
                .ToListAsync();

            return Ok(favorites);
        }



        // ❌ Remove Favorite (IMPORTANT FEATURE 🔥)
        [HttpDelete("removeFavorite")]
        public async Task<IActionResult> RemoveFavorite([FromQuery] int recipeId)
        {
            int uid = GetUserId();

            var fav = await _context.Favorites
                .Include(f => f.Recipe)
                .FirstOrDefaultAsync(f => f.UserId == uid && f.Recipe.ExternalRecipeId == recipeId);

            if (fav == null)
                return NotFound("Favorite not found");

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();

            return Ok("Removed from favorites ❌");
        }

    }
}
