using Microsoft.EntityFrameworkCore;
using SmartRecipeFinder.API.Data;
using SmartRecipeFinder.API.Models;

public class UserAllergyService : IUserAllergyService
{
    private readonly AppDbContext _context;

    public UserAllergyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SaveUserAllergies(int userId, List<int> allergyIds)
    {
        // 1️⃣ Remove old allergies of user
        var existing = await _context.UserAllergies
            .Where(u => u.UserId == userId)
            .ToListAsync();

        _context.UserAllergies.RemoveRange(existing);

        // 2️⃣ Add new allergies
        foreach (var allergyId in allergyIds)
        {
            _context.UserAllergies.Add(new UserAllergy
            {
                UserId = userId,
                AllergyId = allergyId
            });
        }

        await _context.SaveChangesAsync();
    }


    public async Task<List<string>> GetUserAllergies(int userId)
    {
        return await _context.UserAllergies
            .Where(u => u.UserId == userId)
            .Select(u => u.Allergy.Name)
            .ToListAsync();
    }
}
