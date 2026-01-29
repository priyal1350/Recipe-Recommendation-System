import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AppLayout from "../layouts/AppLayout";

export default function SafeSearchRecipes() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [safeRecipes, setSafeRecipes] = useState([]);
  const [unsafeRecipes, setUnsafeRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const defaultFoods = [
    "paneer", "salad", "dal", "smoothie",
    "chicken", "rice", "tofu", "oats", "eggs"
  ];

  // 🛡️ SAFE SEARCH API
  const safeSearch = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    try {
      setLoading(true);

      const res = await api.get(`/recipes/safe-search?query=${searchTerm}`);

      setSafeRecipes(res.data.safeRecipes || []);
      setUnsafeRecipes(res.data.unsafeRecipes || []);
    } catch (err) {
      console.error("Safe search failed:", err.response?.data || err.message);
      alert("Safe search failed ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 Auto-load random default food
  useEffect(() => {
    const randomFood = defaultFoods[Math.floor(Math.random() * defaultFoods.length)];
    safeSearch(randomFood);
  }, [safeSearch]);

  // 🧪 Nutrition fetch
  const getNutrition = async (recipeId) => {
    try {
      const res = await api.get(`/external/recipes/${recipeId}/nutrition`);
      setNutrition(res.data || null);
      setShowPopup(true);
    } catch (err) {
      alert("Failed to load nutrition ❌");
    }
  };

  // ❤️ Favorite
  const addFavorite = async (recipeId) => {
    try {
      await api.post(`/user/addFavorite?recipeId=${recipeId}`);
      alert("Added to favorites ❤️");
    } catch {
      alert("Failed to add favorite ❌");
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h2>🛡️ Safe Recipe Search</h2>

        <div style={styles.searchBar}>
          <input
            placeholder="Search safe food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button style={styles.searchBtn} onClick={() => safeSearch(query)}>
            {loading ? "Searching..." : "Safe Search"}
          </button>
        </div>

        {loading && <p>⏳ Loading...</p>}

        {/* ✅ SAFE RECIPES */}
        <h3 style={{ color: "green" }}>✅ Safe Recipes</h3>
        <div style={styles.grid}>
          {safeRecipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{ ...styles.card, background: "#e8fff1" }}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <h4>{recipe.title}</h4>

              <div style={styles.cardButtons}>
                <button onClick={(e) => { e.stopPropagation(); addFavorite(recipe.id); }}>❤️</button>
                <button onClick={(e) => { e.stopPropagation(); getNutrition(recipe.id); }}>🧪</button>
              </div>
            </div>
          ))}
        </div>

        {/* ⚠️ UNSAFE RECIPES
        <h3 style={{ color: "red", marginTop: "30px" }}>⚠️ Unsafe Recipes</h3>
        <div style={styles.grid}>
          {unsafeRecipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{ ...styles.card, background: "#ffe6e6" }}
            >
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <h4>{recipe.title}</h4>
              <p style={{ color: "red" }}>
                ❌ Danger: {recipe.dangerIngredients.join(", ")}
              </p>
            </div>
          ))}
        </div> */}

        {/* 🧪 POPUP */}
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
  wrapper: { padding: "20px", maxWidth: "1200px", margin: "auto" },
  searchBar: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { padding: "10px", flex: 1, borderRadius: "8px", border: "1px solid #ccc" },
  searchBtn: { padding: "10px 18px", background: "#28a745", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
  card: { border: "1px solid #ddd", padding: "10px", borderRadius: "10px", cursor: "pointer", background: "#fff" },
  image: { width: "100%", borderRadius: "8px" },
  cardButtons: { display: "flex", justifyContent: "space-between", marginTop: "10px" },
  popupOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" },
  popup: { background: "#fff", padding: "20px", borderRadius: "12px", width: "300px", textAlign: "center" }
};
