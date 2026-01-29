import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function SearchRecipes() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const defaultFoods = [
    "paneer", "salad", "dal", "smoothie",
    "chicken", "rice", "tofu", "oats", "eggs"
  ];

  // 🔍 API search (JWT not required but safe)
  const searchRecipes = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    try {
      setLoading(true);

      const res = await api.get(
        `/external/recipes/search?query=${searchTerm}`
      );

      setRecipes(res.data?.results || []);
    } catch (err) {
      console.error("Search failed:", err.response?.data || err.message);
      alert("Recipe search failed ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 Auto-load random default food
  useEffect(() => {
    const randomFood = defaultFoods[Math.floor(Math.random() * defaultFoods.length)];
    searchRecipes(randomFood);
  }, [searchRecipes]);

  // 🧪 Nutrition fetch
  const getNutrition = async (recipeId) => {
    try {
      const res = await api.get(
        `/external/recipes/${recipeId}/nutrition`
      );

      setNutrition(res.data || null);
      setShowPopup(true);
    } catch (err) {
      console.error("Nutrition failed:", err.response?.data || err.message);
      alert("Failed to load nutrition ❌");
    }
  };

  // ❤️ Add Favorite (JWT-based)
  const addFavorite = async (recipeId) => {
    try {
      await api.post(`/user/addFavorite?recipeId=${recipeId}`);
      alert("Added to favorites ❤️");
    } catch (err) {
      console.error("Favorite failed:", err.response?.data || err.message);
      alert("Failed to add favorite ❌");
    }
  };

  // 🛒 Shopping list (JWT-based)
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
    <AppLayout>
      <div style={styles.wrapper}>
        <h2>🔍 Search Recipes</h2>

        <div style={styles.searchBar}>
          <input
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />

          <button style={styles.searchBtn} onClick={() => searchRecipes(query)}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {loading && <p>⏳ Loading...</p>}

        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={styles.card}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <h4>{recipe.title}</h4>

              <div style={styles.cardButtons}>
                <button onClick={(e) => { e.stopPropagation(); addFavorite(recipe.id); }}>❤️</button>
                <button onClick={(e) => { e.stopPropagation(); getNutrition(recipe.id); }}>🧪</button>
                <button onClick={(e) => { e.stopPropagation(); generateShoppingList(recipe.id); }}>🛒</button>
              </div>
            </div>
          ))}
        </div>

        {showPopup && (
          <div style={styles.popupOverlay} onClick={() => setShowPopup(false)}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h3>🧪 Nutrition Info</h3>

              <p>🔥 Calories: {nutrition?.calories ?? "N/A"}</p>
              <p>🥖 Carbs: {nutrition?.carbs ?? "N/A"}</p>
              <p>🥑 Fat: {nutrition?.fat ?? "N/A"}</p>
              <p>💪 Protein: {nutrition?.protein ?? "N/A"}</p>

              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto"
  },
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    flex: 1,
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  searchBtn: {
    padding: "10px 18px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#fff"
  },
  image: {
    width: "100%",
    borderRadius: "8px"
  },
  cardButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  popup: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center"
  }
};
