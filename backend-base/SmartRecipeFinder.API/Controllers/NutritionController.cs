using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
[Route("api/recipes/{id}/nutrition")]
[ApiController]
public class NutritionController : ControllerBase
{
    private readonly AppDbContext _context;

    public NutritionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetNutrition(int id)
    {
        var nutrition = await _context.NutritionInfos
            .FirstOrDefaultAsync(n => n.RecipeId == id);

        if (nutrition == null)
            return NotFound("Nutrition data not found");

        return Ok(nutrition);
    }
}

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/recipes/{id}/nutrition")]
    [ApiController]
    public class NutritionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NutritionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNutrition(int id)
        {
            var nutrition = await _context.NutritionInfos
                .FirstOrDefaultAsync(n => n.RecipeId == id);

            if (nutrition == null)
                return NotFound("Nutrition data not found");

            return Ok(nutrition);
        }
    }

}
