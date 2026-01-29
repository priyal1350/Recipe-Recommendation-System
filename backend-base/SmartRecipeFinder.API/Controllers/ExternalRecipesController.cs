using Microsoft.AspNetCore.Mvc;
using SmartRecipeFinder.API.Services;

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/external/recipes")]
    [ApiController]
    public class ExternalRecipesController : ControllerBase
    {
        private readonly RecipeApiService _service;

        public ExternalRecipesController(RecipeApiService service)
        {
            _service = service;
        }

        // GET /api/external/recipes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipeDetails(int id)
        {
            var data = await _service.GetRecipeDetailsAsync(id);
            return Content(data, "application/json");
        }

        // GET /api/external/recipes/search?query=pasta
        [HttpGet("search")]
        public async Task<IActionResult> Search(
    string query = "",
    string diet = null,
    string intolerances = null,
    string excludeIngredients = null,
    int? minProtein = null,
    int? maxCalories = null)
        {
            var result = await _service.SearchRecipesAsync(
                query,
                diet,
                intolerances,
                excludeIngredients,
                minProtein,
                maxCalories);

            return Content(result, "application/json");
        }


        // GET /api/external/recipes/{id}/nutrition
        [HttpGet("{id}/nutrition")]
        public async Task<IActionResult> GetNutrition(int id)
        {
            var result = await _service.GetRecipeNutritionAsync(id);
            return Content(result, "application/json");
        }

        // GET /api/external/recipes/by-ingredients?ingredients=egg,tomato,onion
        [HttpGet("by-ingredients")]
        public async Task<IActionResult> GetRecipesByIngredients(string ingredients)
        {
            if (string.IsNullOrWhiteSpace(ingredients))
                return BadRequest("Ingredients are required");

            var result = await _service.GetRecipesByIngredientsAsync(ingredients);

            return Content(result, "application/json");
        }




    }
}
