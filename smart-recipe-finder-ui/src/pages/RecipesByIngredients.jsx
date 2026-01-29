import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function RecipesByIngredients() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch recipes by ingredients
  const searchByIngredients = async () => {
    if (!ingredients.trim()) {
      alert("Enter ingredients (comma separated)");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/external/recipes/by-ingredients?ingredients=${ingredients}`
      );

      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch recipes ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Add missing ingredients to shopping list (JWT-based)
  const addMissingToShoppingList = async (recipe) => {
    try {
      for (const ing of recipe.missedIngredients) {
        await api.post(`/shopping/add-manual`, {
          ingredientName: ing.name,
          quantity: ing.amount ? `${ing.amount} ${ing.unit}` : "1 unit"
        });
      }

      alert("Missing ingredients added to shopping list 🛒");
    } catch (err) {
      console.error(err);
      alert("Failed to add shopping items ❌");
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h2>🥬 Cook With What You Have</h2>
        <p style={styles.subtitle}>
          Enter ingredients you already have (comma separated)
        </p>

        <div style={styles.searchBar}>
          <input
            placeholder="eggs, tomato, onion"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={styles.input}
          />
          <button onClick={searchByIngredients} style={styles.searchBtn}>
            {loading ? "Searching..." : "Find Recipes"}
          </button>
        </div>

        {recipes.length === 0 && !loading && (
          <p>No recipes found yet.</p>
        )}

        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card}>
              <img
                src={recipe.image}
                alt={recipe.title}
                style={styles.image}
              />

              <h4>{recipe.title}</h4>

              {/* ✅ Used Ingredients */}
              <p style={styles.usedTitle}>✅ You have:</p>
              <ul>
                {recipe.usedIngredients.map((ing) => (
                  <li key={ing.id} style={{ color: "green" }}>
                    {ing.name}
                  </li>
                ))}
              </ul>

              {/* ❌ Missing Ingredients */}
              <p style={styles.missedTitle}>❌ Missing:</p>
              <ul>
                {recipe.missedIngredients.map((ing) => (
                  <li key={ing.id} style={{ color: "red" }}>
                    {ing.name}
                  </li>
                ))}
              </ul>

              <div style={styles.cardButtons}>
                <button
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  📖 View Recipe
                </button>

                <button
                  onClick={() => addMissingToShoppingList(recipe)}
                >
                  🛒 Add Missing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    padding: "25px",
    maxWidth: "1200px",
    margin: "auto"
  },
  subtitle: {
    color: "#666",
    marginBottom: "15px"
  },
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px"
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  searchBtn: {
    padding: "12px 20px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px"
  },
  usedTitle: {
    marginTop: "10px",
    fontWeight: "bold"
  },
  missedTitle: {
    marginTop: "8px",
    fontWeight: "bold"
  },
  cardButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px"
  }
};
