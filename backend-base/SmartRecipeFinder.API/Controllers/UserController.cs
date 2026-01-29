using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;
using System.Security.Claims;

namespace SmartRecipeFinder.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get Logged-in User Profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst("userId")?.Value;

            if (userId == null)
                return Unauthorized("Invalid token");

            int uid = int.Parse(userId);

            var user = await _context.Users
                .Where(u => u.UserId == uid)
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.DietPreference,
                    u.AgeGroup
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // ✅ Update User Profile
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] RegisterRequest req)
        {
            var userId = User.FindFirst("userId")?.Value;

            if (userId == null)
                return Unauthorized("Invalid token");

            int uid = int.Parse(userId);

            var user = await _context.Users.FindAsync(uid);

            if (user == null)
                return NotFound("User not found");

            user.Name = req.Name;
            user.DietPreference = req.DietPreference;
            user.AgeGroup = req.AgeGroup;

            await _context.SaveChangesAsync();

            return Ok("Profile updated ✅");
        }
    }
}
