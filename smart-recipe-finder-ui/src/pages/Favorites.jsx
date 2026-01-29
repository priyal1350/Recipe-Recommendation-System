import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const fetchFavorites = useCallback(async () => {
  try {
    const res = await api.get("/user/favorites");

    console.log("Favorites from backend:", res.data);

    // ✅ Backend already returns full recipes
    setRecipes(res.data || []);
  } catch (err) {
    console.error(
      "Favorites load failed:",
      err.response?.data || err.message
    );
  }
}, []);


  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (recipeId) => {
    try {
      // ✅ Correct API path
      await api.delete(`/user/removeFavorite?recipeId=${recipeId}`);

      setRecipes((prev) =>
        prev.filter((item) => item.id !== recipeId)
      );
    } catch (err) {
      console.error(
        "Remove favorite failed:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>❤️ Your Favorite Recipes</h2>

        {recipes.length === 0 && (
          <p style={styles.empty}>No favorites yet</p>
        )}

        <div style={styles.grid}>
          {recipes.map((r) => (
            <div
              key={r.id}
              style={styles.card}
              onClick={() => navigate(`/recipe/${r.id}`)}
            >
              <img
                src={r.image}
                alt={r.title}
                style={styles.image}
              />

              <h4 style={styles.recipeTitle}>{r.title}</h4>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(r.id);
                }}
                style={styles.removeBtn}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    maxWidth: "1200px",
    margin: "auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    marginBottom: "20px",
  },

  empty: {
    color: "#666",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    position: "relative",
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
    transition: "transform 0.2s ease",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "8px",
  },

  recipeTitle: {
    fontSize: "15px",
    marginTop: "6px",
  },

  removeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
};
