import { useState } from "react";
import api from "../api"; // ✅ JWT axios instance

export default function RecipeSearch() {
  const [name, setName] = useState("");
  const [recipes, setRecipes] = useState([]);

  // 🔍 Search recipes
  const search = async () => {
    try {
      const res = await api.get(`/external/recipes/search?query=${name}`);
      setRecipes(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err.response?.data || err.message);
      alert("Failed to search recipes ❌");
    }
  };

  // ❤️ Add to favorites (JWT-based)
  const addFavorite = async (recipeId) => {
    try {
      await api.post(`/user/addFavorite?recipeId=${recipeId}`);
      alert("Added to favorites ❤️");
    } catch (err) {
      console.error("Add favorite failed:", err.response?.data || err.message);
      alert("Failed to add favorite ❌");
    }
  };

  // 🧪 Get nutrition info
  const getNutrition = async (recipeId) => {
    try {
      const res = await api.get(`/external/recipes/${recipeId}/nutrition`);
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Nutrition failed:", err.response?.data || err.message);
      alert("Failed to get nutrition ❌");
    }
  };

  // 🛒 Generate shopping list (JWT-based)
  const generateShoppingList = async (recipeId) => {
    try {
      await api.post(`/shopping/generate?recipeId=${recipeId}`);
      alert("Shopping list generated 🛒");
    } catch (err) {
      console.error("Shopping list failed:", err.response?.data || err.message);
      alert("Failed to generate shopping list ❌");
    }
  };

  return (
    <div>
      <h2>Recipe Search</h2>

      <input
        placeholder="Search recipe"
        onChange={e => setName(e.target.value)}
      />
      <button onClick={search}>Search</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {recipes.map(r => (
          <div
            key={r.id}
            style={{ border: "1px solid #ccc", padding: "10px", width: "250px", borderRadius: "10px" }}
          >
            <img src={r.image} alt={r.title} width="100%" style={{ borderRadius: "10px" }} />
            <h4>{r.title}</h4>

            <button onClick={() => addFavorite(r.id)}>❤️ Favorite</button>
            <button onClick={() => getNutrition(r.id)}>🧪 Nutrition</button>
            <button onClick={() => generateShoppingList(r.id)}>🛒 Shopping List</button>
          </div>
        ))}
      </div>
    </div>
  );
}
