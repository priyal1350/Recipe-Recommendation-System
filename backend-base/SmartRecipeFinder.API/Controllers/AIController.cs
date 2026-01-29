using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/ai")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AiController(IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient();
        }

        // GET: /api/ai/foodfact
        [HttpGet("foodfact")]
        public async Task<IActionResult> GetFoodFact()
        {
            var apiKey = _config["Spoonacular:ApiKey"];
            var url = $"https://api.spoonacular.com/food/trivia/random?apiKey={apiKey}";

            var result = await _httpClient.GetStringAsync(url);

            return Content(result, "application/json");
        }

        // GET: /api/ai/foodnews
        [HttpGet("foodnews")]
        public async Task<IActionResult> GetFoodNews()
        {
            var apiKey = _config["NewsApi:ApiKey"];

            using var client = new HttpClient();

            client.DefaultRequestHeaders.Add("User-Agent", "SmartRecipeFinder");

            // 🔥 Strong Food + Fitness Keywords
            var url = $"https://newsapi.org/v2/everything?" +
                         $"q=nutrition OR healthy food OR protein diet OR calorie intake OR fat loss OR Indian diet" +
                         $"&language=en" +
                         $"&sortBy=publishedAt" +
                         $"&pageSize=12" +
                         $"&domains=bbc.com,ndtv.com,healthline.com,indianexpress.com,thehindu.com" +
                         $"&apiKey={apiKey}";
            var response = await client.GetStringAsync(url);

            return Content(response, "application/json");
        }

    }
}
