using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json; // 1. Add this for cleaner JSON handling
using SmartRecipeFinder.API.Models;

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/ai")]
    [ApiController]
    public class AiMealPlannerController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        // 2. Inject IHttpClientFactory for better performance
        public AiMealPlannerController(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("mealplan")]
        public async Task<IActionResult> GetMealPlan([FromBody] MealPlanRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Goal))
                return BadRequest("Goal is required");

            var apiKey = _config["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "API Key is missing from configuration.");

            var prompt = $"Create a healthy Indian meal plan for {req.Goal} with calories and protein.";

            // 3. Use 'gemini-1.5-flash' (faster/cheaper) or keep 'gemini-pro'
            var url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;
            // 4. Create an object and serialize it. This handles quotes/special chars automatically.
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            // 5. Send the request
            var response = await _httpClient.PostAsync(url, jsonContent);

            // 6. Read the raw response
            var rawResponse = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // Return the error details from Gemini if the call fails
                return StatusCode((int)response.StatusCode, rawResponse);
            }

            // Return the raw JSON to your frontend
            return Content(rawResponse, "application/json");
        }
    }
}