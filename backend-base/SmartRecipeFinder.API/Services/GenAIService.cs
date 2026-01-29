using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace SmartRecipeFinder.API.Services
{
    public class GenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GenAIService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GetRecipeSuggestions(
            string ingredients,
            string diet,
            string allergies,
            string ageGroup)
        {
            var apiKey = _config["OpenAI:ApiKey"];

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.openai.com/v1/responses");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            var prompt =
                $"Suggest 5 {diet} recipes for {ageGroup} using {ingredients} " +
                $"but avoid {allergies}. Return recipe name and short description.";

            var body = new
            {
                model = "gpt-4.1-mini",
                input = prompt
            };

            request.Content = new StringContent(
                JsonConvert.SerializeObject(body),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();
            dynamic json = JsonConvert.DeserializeObject(result);

            return json?.output?[0]?.content?[0]?.text?.ToString()
                   ?? "No recipes returned.";
        }
    }
}
