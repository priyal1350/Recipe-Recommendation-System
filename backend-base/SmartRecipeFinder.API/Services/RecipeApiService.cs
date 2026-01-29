using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;
using System.Net.Http;
using System.Text.Json;

namespace SmartRecipeFinder.API.Services
{
    public class RecipeApiService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public RecipeApiService(HttpClient httpClient, IConfiguration config, AppDbContext context)
        {
            _httpClient = httpClient;
            _config = config;
            _context = context;
        }


        public async Task<string> SearchRecipesAsync(
    string query = "",
    string diet = null,
    string intolerances = null,
    string excludeIngredients = null,
    int? minProtein = null,
    int? maxCalories = null)
        {
            var apiKey = _config["Spoonacular:ApiKey"];

            var url = $"https://api.spoonacular.com/recipes/complexSearch?apiKey={apiKey}&number=20&addRecipeInformation=true";

            if (!string.IsNullOrWhiteSpace(query))
                url += $"&query={query}";

            if (!string.IsNullOrEmpty(diet) && diet != "nonveg")
                url += $"&diet={diet}";

            if (!string.IsNullOrEmpty(intolerances))
                url += $"&intolerances={intolerances}";

            if (!string.IsNullOrEmpty(excludeIngredients))
                url += $"&excludeIngredients={excludeIngredients}";

            if (minProtein.HasValue)
                url += $"&minProtein={minProtein}";

            if (maxCalories.HasValue)
                url += $"&maxCalories={maxCalories}";

            Console.WriteLine("🔍 Spoonacular URL → " + url);

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine("❌ Spoonacular Error: " + error);

                return $"{{\"error\":\"API failed\",\"details\":{System.Text.Json.JsonSerializer.Serialize(error)}}}";
            }

            var json = await response.Content.ReadAsStringAsync();

            // 🍗 Filter Non-Veg only
            if (diet == "nonveg")
            {
                using var doc = System.Text.Json.JsonDocument.Parse(json);

                var results = doc.RootElement.GetProperty("results");

                var nonVeg = results.EnumerateArray()
                    .Where(r => !r.GetProperty("vegetarian").GetBoolean())
                    .ToList();

                var filteredJson = System.Text.Json.JsonSerializer.Serialize(new { results = nonVeg });

                return filteredJson;
            }

            return json;
        }

        public async Task<string> GetRecipesByIngredientsAsync(string ingredients)
        {
            var apiKey = _config["Spoonacular:ApiKey"];

            var url =
                $"https://api.spoonacular.com/recipes/findByIngredients" +
                $"?ingredients={ingredients}" +
                $"&number=10" +
                $"&ranking=1" +
                $"&ignorePantry=true" +
                $"&apiKey={apiKey}";

            Console.WriteLine("🧺 Spoonacular By Ingredients → " + url);

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine("❌ Spoonacular Error: " + error);
                return error;
            }

            return await response.Content.ReadAsStringAsync();
        }




        public async Task<string> GetRecipeNutritionAsync(int recipeId)
        {
            try
            {
                var apiKey = _config["Spoonacular:ApiKey"];
                var url = $"https://api.spoonacular.com/recipes/{recipeId}/nutritionWidget.json?apiKey={apiKey}";

                return await _httpClient.GetStringAsync(url);
            }
            catch
            {
                return "{\"error\":\"Nutrition not found\"}";
            }
        }


        public async Task<string> GetRecipeDetailsAsync(int recipeId)
        {
            try
            {
                var apiKey = _config["Spoonacular:ApiKey"];
                var url = $"https://api.spoonacular.com/recipes/{recipeId}/information?apiKey={apiKey}";

                return await _httpClient.GetStringAsync(url);
            }
            catch
            {
                return "{\"error\":\"Recipe not found\"}";
            }
        }

        public async Task<List<Recipe>> GetSafeRecipes(int userId)
        {
            var userAllergyIds = await _context.UserAllergies
                .Where(u => u.UserId == userId)
                .Select(u => u.AllergyId)
                .ToListAsync();

            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .ThenInclude(i => i.IngredientAllergies)
                .ToListAsync();

            var safeRecipes = recipes.Where(recipe =>
                !recipe.RecipeIngredients.Any(ri =>
                    ri.Ingredient.IngredientAllergies.Any(ia =>
                        userAllergyIds.Contains(ia.AllergyId)
                    )
                )
            ).ToList();

            return safeRecipes;
        }



    }
}
