using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;

namespace SmartRecipeFinder.API.Controllers
{
    [Route("api/allergy")]
    [ApiController]
    [Authorize]
    public class AllergyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AllergyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAllergies()
        {
            var allergies = await _context.Allergies.ToListAsync();
            return Ok(allergies);
        }
    }
}
