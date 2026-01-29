using SmartRecipeFinder.API.DTOs;

public interface IUserAllergyService
{
    Task SaveUserAllergies(int userId, List<int> allergyIds);
    Task<List<string>> GetUserAllergies(int userId);
}
