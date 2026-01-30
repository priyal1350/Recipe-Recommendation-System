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

public AiController(IConfiguration config, IHttpClientFactory factory)
{
    _config = config;
    _httpClient = factory.CreateClient();
    _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0");
    _httpClient.Timeout = TimeSpan.FromSeconds(10);
}


        [HttpGet("debug-key")]
public IActionResult DebugKey()
{
    var spoonKey = _config["Spoonacular:ApiKey"];
    var newsKey = _config["NewsApi:ApiKey"];

    return Ok(new
    {
        SpoonacularKey = spoonKey,
        NewsApiKey = newsKey
    });
}


        // GET: /api/ai/foodfact
        [HttpGet("foodfact")]
public async Task<IActionResult> GetFoodFact()
{
    try
    {
        var apiKey = _config["Spoonacular:ApiKey"];

        if (string.IsNullOrEmpty(apiKey))
            return StatusCode(500, "Spoonacular API key missing");

        var url = $"https://api.spoonacular.com/food/trivia/random?apiKey={apiKey}";

        var response = await _httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, content);
        }

        return Content(content, "application/json");
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.Message);
    }
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
