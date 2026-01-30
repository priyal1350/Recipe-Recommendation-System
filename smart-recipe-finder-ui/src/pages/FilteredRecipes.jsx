import { useEffect, useState, useCallback } from "react"; // ✅ added useCallback
import api from "../api";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

export default function FilteredRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [diet, setDiet] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [minProtein, setMinProtein] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("query", "healthy");

    const res = await api.get(`/external/recipes/search?${params.toString()}`);

    setRecipes(res.data.results || []);
  } catch (err) {
    console.error("❌ Failed to load filtered recipes:", err.response?.data || err.message);
    alert("Failed to load recipes ❌");
  } finally {
    setLoading(false);
  }
}, [diet, maxCalories, minProtein]); // ✅ dependencies added

      setRecipes(res.data.results || []);
    } catch (err) {
      console.error("❌ Failed to load filtered recipes:", err.response?.data || err.message);
      alert("Failed to load recipes ❌");
    } finally {
      setLoading(false);
    }
  }, [diet, maxCalories, minProtein]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]); // ✅ ESLint satisfied

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>🥗 Healthy Filtered Recipes</h2>

        {/* Filters */}
        <div style={styles.filters}>
          <select style={styles.select} value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">All Recipes</option>
            <option value="vegetarian">🥦 Vegetarian</option>
            <option value="vegan">🌱 Vegan</option>
            <option value="nonveg">🍗 Non-Veg</option>
          </select>

          <select style={styles.select} value={maxCalories} onChange={(e) => setMaxCalories(e.target.value)}>
            <option value="">Calories</option>
            <option value="400">Under 400</option>
            <option value="600">Under 600</option>
            <option value="800">Under 800</option>
          </select>

          <select style={styles.select} value={minProtein} onChange={(e) => setMinProtein(e.target.value)}>
            <option value="">Protein</option>
            <option value="10">Medium Protein</option>
            <option value="20">High Protein</option>
            <option value="30">Very High Protein</option>
          </select>
        </div>

        {loading && <p style={styles.loading}>⏳ Loading recipes...</p>}

        {!loading && recipes.length === 0 && (
          <p style={styles.empty}>No recipes found 😔</p>
        )}

        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={styles.card}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <img
                src={recipe.image || "https://via.placeholder.com/300"}
                alt={recipe.title}
                style={styles.image}
              />
              <h4 style={styles.recipeTitle}>{recipe.title}</h4>
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
    fontSize: "22px",
  },

  loading: {
    textAlign: "center",
    color: "#667eea",
  },

  empty: {
    textAlign: "center",
    color: "#777",
  },

  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "8px",
  },

  recipeTitle: {
    fontSize: "14px",
    fontWeight: "500",
  },
};
