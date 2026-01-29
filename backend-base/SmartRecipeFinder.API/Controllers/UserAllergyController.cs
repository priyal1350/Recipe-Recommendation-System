using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRecipeFinder.API.DTOs;
using SmartRecipeFinder.API.Models;

[Route("api/user/allergies")]
[ApiController]
[Authorize]
public class UserAllergyController : ControllerBase
{
    private readonly IUserAllergyService _service;

    public UserAllergyController(IUserAllergyService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> SaveUserAllergies([FromBody] UserAllergyDto dto)
    {
        var userId = int.Parse(User.FindFirst("userId").Value);

        await _service.SaveUserAllergies(userId, dto.AllergyIds);

        return Ok(new { message = "Allergies saved successfully" });
    }

    [HttpGet]
    public async Task<IActionResult> GetUserAllergies()
    {
        var userId = int.Parse(User.FindFirst("userId").Value);

        var allergies = await _service.GetUserAllergies(userId);

        return Ok(allergies);
    }
}
