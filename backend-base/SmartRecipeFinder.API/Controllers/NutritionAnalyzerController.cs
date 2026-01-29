using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/nutrition")]
    [ApiController]
    public class NutritionAnalyzerController : ControllerBase
    {
        private readonly IConfiguration _config;

        public NutritionAnalyzerController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] string food)
        {
            var apiKey = _config["Spoonacular:ApiKey"];

            var url = $"https://api.spoonacular.com/recipes/parseIngredients?includeNutrition=true&apiKey={apiKey}";

            var formData = $"ingredientList=1 {food}&servings=1";

            using var client = new HttpClient();
            var content = new StringContent(formData, Encoding.UTF8, "application/x-www-form-urlencoded");

            var response = await client.PostAsync(url, content);
            var raw = await response.Content.ReadAsStringAsync();

            Console.WriteLine("SPOONACULAR RESPONSE:");
            Console.WriteLine(raw);

            if (!response.IsSuccessStatusCode)
                return BadRequest(raw);

            return Content(raw, "application/json");
        }
    }
}
