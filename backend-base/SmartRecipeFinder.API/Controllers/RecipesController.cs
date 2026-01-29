using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;
using SmartRecipeFinder.API.Services;
using System.Text.Json;

namespace SmartRecipeFinder.API.Controllers
{
    [Authorize]
    [Route("api/recipes")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string? _apiKey;
        private readonly RecipeApiService _recipeApiService;

        public RecipeController(AppDbContext context, IConfiguration config, RecipeApiService recipeApiService)
        {
            _context = context;
            _apiKey = config["Spoonacular:ApiKey"];
            _recipeApiService = recipeApiService;
        }


        // ✅ GET Recipe Details by ID (.NET → Spoonacular)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            // 1️⃣ Check DB first
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.RecipeId == id);

            if (recipe != null)
            {
                return Ok(new
                {
                    id = recipe.RecipeId,
                    externalId = recipe.ExternalRecipeId,
                    title = recipe.Title,
                    cookingTime = recipe.CookingTime,
                    category = recipe.Category,
                    vegan = recipe.IsVegan,
                    glutenFree = recipe.IsGlutenFree,
                    ingredients = recipe.RecipeIngredients.Select(ri => new
                    {
                        name = ri.Ingredient.Name,
                        quantity = ri.Quantity
                    })
                });
            }


            // 2️⃣ Call Spoonacular API
            var http = new HttpClient();
            var res = await http.GetFromJsonAsync<JsonElement>(
                $"https://api.spoonacular.com/recipes/{id}/information?apiKey={_apiKey}"
            );

            string category = "External";
            if (res.TryGetProperty("dishTypes", out var dishTypes) && dishTypes.GetArrayLength() > 0)
            {
                category = dishTypes[0].GetString();
            }

            // ✅ Extract Ingredients with Quantity
            var ingredientData = new List<(string name, string quantity)>();

            if (res.TryGetProperty("extendedIngredients", out var extIngredients))
            {
                foreach (var item in extIngredients.EnumerateArray())
                {
                    string name = item.GetProperty("name").GetString();
                    string amount = item.GetProperty("amount").ToString();
                    string unit = item.GetProperty("unit").GetString();

                    string quantity = $"{amount} {unit}".Trim();
                    ingredientData.Add((name, quantity));
                }
            }

            // ✅ Allergy Keyword Mapping
            var allergyKeywords = new Dictionary<string, string>
{
    { "milk", "Milk" },
    { "cheese", "Milk" },
    { "butter", "Milk" },
    { "paneer", "Milk" },
    { "cream", "Milk" },
    { "curd", "Milk" },
    { "yogurt", "Milk" },

    { "peanut", "Peanut" },
    { "groundnut", "Peanut" },

    { "wheat", "Gluten" },
    { "flour", "Gluten" },
    { "bread", "Gluten" },
    { "pasta", "Gluten" },

    { "egg", "Egg" },
    { "eggs", "Egg" },
    { "yolk", "Egg" },
    { "mayonnaise", "Egg" },
    { "omelette", "Egg" },

    { "soy", "Soy" },
    { "soya", "Soy" },
    { "tofu", "Soy" },

    { "fish", "Seafood" },
    { "shrimp", "Seafood" },
    { "prawn", "Seafood" },
    { "crab", "Seafood" },
    { "lobster", "Seafood" },

    { "almond", "Nuts" },
    { "cashew", "Nuts" },
    { "walnut", "Nuts" },
    { "pistachio", "Nuts" }
};


            // ✅ Save Recipe in DB
            // ✅ Check if recipe already exists by ExternalRecipeId
            var recipeEntity = await _context.Recipes
                .FirstOrDefaultAsync(r => r.ExternalRecipeId == id);

            if (recipeEntity == null)
            {
                recipeEntity = new Recipe
                {
                    ExternalRecipeId = res.GetProperty("id").GetInt32(),
                    Title = res.GetProperty("title").GetString(),
                    CookingTime = res.GetProperty("readyInMinutes").GetInt32(),
                    Category = category,
                    IsVegan = res.GetProperty("vegan").GetBoolean(),
                    IsGlutenFree = res.GetProperty("glutenFree").GetBoolean(),
                    Difficulty = "API"
                };

                _context.Recipes.Add(recipeEntity);
                await _context.SaveChangesAsync();
            }


            // ✅ Save Ingredients + Quantity + Allergy Mapping
            foreach (var ing in ingredientData)
            {
                string ingName = ing.name.ToLower();
                string quantity = string.IsNullOrWhiteSpace(ing.quantity) ? "as required" : ing.quantity;

                var ingredient = await _context.Ingredients
                    .FirstOrDefaultAsync(i => i.Name.ToLower() == ingName);

                if (ingredient == null)
                {
                    ingredient = new Ingredient { Name = ing.name };
                    _context.Ingredients.Add(ingredient);
                    await _context.SaveChangesAsync();
                }

                // Link Recipe ↔ Ingredient
                var existsLink = await _context.RecipeIngredients
                    .AnyAsync(ri => ri.RecipeId == recipeEntity.RecipeId && ri.IngredientId == ingredient.IngredientId);

                if (!existsLink)
                {
                    _context.RecipeIngredients.Add(new RecipeIngredient
                    {
                        RecipeId = recipeEntity.RecipeId,
                        IngredientId = ingredient.IngredientId,
                        Quantity = quantity
                    });
                }

                // Auto map Ingredient → Allergy
                foreach (var keyword in allergyKeywords)
                {
                    if (ingName.Contains(keyword.Key))
                    {
                        var allergy = await _context.Allergies
                            .FirstOrDefaultAsync(a => a.Name == keyword.Value);

                        if (allergy != null)
                        {
                            var existsMap = await _context.IngredientAllergies
                                .AnyAsync(ia => ia.IngredientId == ingredient.IngredientId &&
                                                ia.AllergyId == allergy.AllergyId);

                            if (!existsMap)
                            {
                                _context.IngredientAllergies.Add(new IngredientAllergy
                                {
                                    IngredientId = ingredient.IngredientId,
                                    AllergyId = allergy.AllergyId
                                });
                            }
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            // ✅ Reload recipe with ingredients from DB
            var finalRecipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.ExternalRecipeId == id);

            return Ok(new
            {
                id = finalRecipe.RecipeId,
                externalId = finalRecipe.ExternalRecipeId,
                title = finalRecipe.Title,
                cookingTime = finalRecipe.CookingTime,
                category = finalRecipe.Category,
                vegan = finalRecipe.IsVegan,
                glutenFree = finalRecipe.IsGlutenFree,
                ingredients = finalRecipe.RecipeIngredients.Select(ri => new
                {
                    name = ri.Ingredient.Name,
                    quantity = ri.Quantity
                })
            });

        }
        [HttpGet("debug/{id}")]
        public async Task<IActionResult> DebugRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.ExternalRecipeId == id);

            return Ok(recipe);
        }



        [HttpGet("safe-search")]
        public async Task<IActionResult> SafeSearch([FromQuery] string query)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("UserId not found in token");

            int userId = int.Parse(userIdClaim);

            var userAllergyNames = await _context.UserAllergies
                .Where(u => u.UserId == userId)
                .Select(u => u.Allergy.Name.ToLower())
                .ToListAsync();

            // ✅ PASTE HERE 👇
            var allergyMap = new Dictionary<string, List<string>>
{
    { "egg", new List<string> { "egg", "eggs", "yolk", "albumen", "mayonnaise", "omelette" } },
    { "milk", new List<string> { "milk", "cheese", "butter", "cream", "curd", "yogurt" } },
    { "peanut", new List<string> { "peanut", "groundnut" } },
    { "gluten", new List<string> { "wheat", "flour", "bread", "pasta" } },
    { "soy", new List<string> { "soy", "soya", "tofu" } },
    { "seafood", new List<string> { "fish", "shrimp", "prawn", "crab" } },
    { "nuts", new List<string> { "almond", "cashew", "walnut", "pistachio" } }
};


            var http = new HttpClient();
            JsonElement searchRes;

            try
            {
                searchRes = await http.GetFromJsonAsync<JsonElement>(
                    $"https://api.spoonacular.com/recipes/complexSearch?query={query}&number=10&addRecipeInformation=true&apiKey={_apiKey}"
                );
            }
            catch
            {
                return StatusCode(500, "Spoonacular API failed");
            }

            if (!searchRes.TryGetProperty("results", out var results))
                return Ok(new { safeRecipes = new List<object>(), unsafeRecipes = new List<object>() });

            var safeResults = new List<object>();
            var unsafeResults = new List<object>();

            foreach (var r in results.EnumerateArray())
            {
                int externalId = r.GetProperty("id").GetInt32();
                string title = r.GetProperty("title").GetString();
                string image = r.GetProperty("image").GetString();

                var ingredientNames = new List<string>();

                if (r.TryGetProperty("extendedIngredients", out var extIngredients)
                    && extIngredients.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in extIngredients.EnumerateArray())
                    {
                        if (item.TryGetProperty("name", out var nameProp))
                        {
                            ingredientNames.Add(nameProp.GetString()?.ToLower() ?? "");
                        }
                    }
                }

                string lowerTitle = title.ToLower();

                var dangerIngredients = ingredientNames
                    .Where(name => userAllergyNames.Any(allergy =>
                        allergyMap.ContainsKey(allergy) &&
                        allergyMap[allergy].Any(keyword => name.Contains(keyword))
                    ))
                    .Distinct()
                    .ToList();

                // ✅ Also check recipe title for allergy words
                bool titleHasAllergy = userAllergyNames.Any(allergy =>
                    allergyMap.ContainsKey(allergy) &&
                    allergyMap[allergy].Any(keyword => lowerTitle.Contains(keyword))
                );


                if (dangerIngredients.Count == 0 && !titleHasAllergy)
                {
                    safeResults.Add(new { id = externalId, title, image });
                }
                else
                {
                    unsafeResults.Add(new { id = externalId, title, image, dangerIngredients });
                }
            }

            return Ok(new
            {
                safeRecipes = safeResults,
                unsafeRecipes = unsafeResults
            });
        }








    }
}
