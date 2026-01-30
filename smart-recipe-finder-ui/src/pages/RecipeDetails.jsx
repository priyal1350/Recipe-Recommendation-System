import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/external/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("❌ Details load failed:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setError("Failed to load recipe details ❌");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          ⏳ Loading recipe...
        </p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
          {error}
        </p>
      </AppLayout>
    );
  }

  if (!recipe) return null;

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{recipe.title}</h1>
        </div>

        {/* Image */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={styles.image}
          />
        )}

        {/* Meta Info */}
        <div style={styles.meta}>
          <span>⏱ {recipe.readyInMinutes || recipe.cookingTime || "N/A"} mins</span>
          <span>🍽 {recipe.dishTypes?.[0] || recipe.category || "Recipe"}</span>
          <span>{recipe.vegan ? "🌱 Vegan" : "🥩 Non-Vegan"}</span>
          <span>
            {recipe.glutenFree ? "🚫 Gluten Free" : "🌾 Contains Gluten"}
          </span>
        </div>

        {/* Ingredients */}
        <div style={styles.section}>
          <h3>🧺 Ingredients</h3>
          <ul style={styles.list}>
            {(recipe.extendedIngredients || recipe.ingredients || []).map((i, idx) => (
              <li key={idx}>
                {i.original || `${i.name} - ${i.quantity || ""}`}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div style={styles.section}>
          <h3>👨‍🍳 Instructions</h3>
          <div style={styles.instructions}>
            {recipe.instructions
              ? recipe.instructions.replace(/<[^>]+>/g, "")
              : "No instructions available."}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    maxWidth: "900px",
    margin: "auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
  },

  header: {
    marginBottom: "15px",
  },

  title: {
    fontSize: "30px",
  },

  image: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#444",
  },

  section: {
    marginBottom: "25px",
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "1.6",
  },

  instructions: {
    lineHeight: "1.7",
    color: "#333",
    whiteSpace: "pre-line",
  },
};
