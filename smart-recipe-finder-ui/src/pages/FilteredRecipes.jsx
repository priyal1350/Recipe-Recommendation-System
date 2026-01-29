import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../layouts/AppLayout";

const API_BASE = "https://localhost:7060/api";

export default function FilteredRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [diet, setDiet] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [minProtein, setMinProtein] = useState("");

  const loadRecipes = async () => {
    try {
      let url = `${API_BASE}/external/recipes/search?query=`;

      if (diet) url += `&diet=${diet}`;
      if (maxCalories) url += `&maxCalories=${maxCalories}`;
      if (minProtein) url += `&minProtein=${minProtein}`;

      const res = await axios.get(url);
      setRecipes(res.data.results || []);
    } catch (err) {
      console.error(
        "Failed to load filtered recipes:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [diet, maxCalories, minProtein]);

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>🥗 Healthy Filtered Recipes</h2>

        {/* Filters */}
        <div style={styles.filters}>
          <select style={styles.select} onChange={(e) => setDiet(e.target.value)}>
            <option value="">All Recipes</option>
            <option value="vegetarian">🥦 Vegetarian</option>
            <option value="vegan">🌱 Vegan</option>
            <option value="nonveg">🍗 Non-Veg</option>
          </select>

          <select
            style={styles.select}
            onChange={(e) => setMaxCalories(e.target.value)}
          >
            <option value="">Calories</option>
            <option value="400">Under 400</option>
            <option value="600">Under 600</option>
          </select>

          <select
            style={styles.select}
            onChange={(e) => setMinProtein(e.target.value)}
          >
            <option value="">Protein</option>
            <option value="20">High Protein</option>
          </select>
        </div>

        {/* Recipes */}
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card}>
              <img
                src={recipe.image}
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
  },

  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
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
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "8px",
  },

  recipeTitle: {
    fontSize: "14px",
  },
};
