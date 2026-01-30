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
  const [error, setError] = useState("");
  const [showUnsafe, setShowUnsafe] = useState(false);

  const defaultFoods = [
    "paneer", "salad", "dal", "smoothie",
    "chicken", "rice", "tofu", "oats", "eggs"
  ];

  // 🛡️ SAFE SEARCH API
  const safeSearch = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    try {
      setLoading(true);
      setError("");

      const encoded = encodeURIComponent(searchTerm);

      const res = await api.get(`/recipes/safe-search?query=${encoded}`);

      setSafeRecipes(res.data.safeRecipes || []);
      setUnsafeRecipes(res.data.unsafeRecipes || []);
    } catch (err) {
      console.error("Safe search failed:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        setError("Safe search failed ❌");
      }
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
      console.error("Nutrition error:", err.response?.data || err.message);
      alert("Failed to load nutrition ❌");
    }
  };

  // ❤️ Favorite
  const addFavorite = async (recipeId) => {
    try {
      await api.post(`/user/addFavorite?recipeId=${recipeId}`);
      alert("Added to favorites ❤️");
    } catch (err) {
      console.error("Favorite error:", err.response?.data || err.message);
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

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p>⏳ Loading...</p>}

        {/* ✅ SAFE RECIPES */}
        <h3 style={{ color: "green" }}>✅ Safe Recipes</h3>

        {safeRecipes.length === 0 && !loading && (
          <p>No safe recipes found.</p>
        )}

        <div style={styles.grid}>
          {safeRecipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{ ...styles.card, background: "#e8fff1" }}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} style={styles.image} />
              )}
              <h4>{recipe.title}</h4>

              <div style={styles.cardButtons}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addFavorite(recipe.id);
                  }}
                >
                  ❤️ Favorite
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    getNutrition(recipe.id);
                  }}
                >
                  🧪 Nutrition
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ⚠️ UNSAFE RECIPES TOGGLE */}
        {unsafeRecipes.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <button
              style={styles.toggleBtn}
              onClick={() => setShowUnsafe(!showUnsafe)}
            >
              {showUnsafe ? "Hide Unsafe Recipes ❌" : "Show Unsafe Recipes ⚠️"}
            </button>

            {showUnsafe && (
              <>
                <h3 style={{ color: "red", marginTop: "15px" }}>
                  ⚠️ Unsafe Recipes
                </h3>

                <div style={styles.grid}>
                  {unsafeRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      style={{ ...styles.card, background: "#ffe6e6" }}
                    >
                      {recipe.image && (
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          style={styles.image}
                        />
                      )}
                      <h4>{recipe.title}</h4>
                      <p style={{ color: "red" }}>
                        ❌ Danger: {(recipe.dangerIngredients || []).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 🧪 POPUP */}
        {showPopup && (
          <div style={styles.popupOverlay} onClick={() => setShowPopup(false)}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h3>🧪 Nutrition Info</h3>

              <p>🔥 Calories: {nutrition?.calories ?? nutrition?.Calories ?? "N/A"}</p>
              <p>🥖 Carbs: {nutrition?.carbs ?? nutrition?.Carbs ?? "N/A"}</p>
              <p>🥑 Fat: {nutrition?.fat ?? nutrition?.Fats ?? "N/A"}</p>
              <p>💪 Protein: {nutrition?.protein ?? nutrition?.Protein ?? "N/A"}</p>

              <button style={styles.closeBtn} onClick={() => setShowPopup(false)}>
                Close
              </button>
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
  searchBtn: {
    padding: "10px 18px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: "10px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease",
  },
  image: { width: "100%", borderRadius: "10px", marginBottom: "8px" },
  cardButtons: { display: "flex", justifyContent: "space-between", marginTop: "10px" },
  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    background: "#fff",
    padding: "22px",
    borderRadius: "14px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  closeBtn: {
    marginTop: "10px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
  },
  toggleBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
};
