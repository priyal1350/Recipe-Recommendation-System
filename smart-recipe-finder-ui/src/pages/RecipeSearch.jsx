import { useState } from "react";
import { recipeApi } from "../services/api"; // ✅ .NET API

export default function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search recipes (Safe Search API)
  const search = async () => {
  if (!query) {
    alert("Please enter recipe name");
    return;
  }

  try {
    setLoading(true);

    const res = await recipeApi.get(`/recipes/safe-search?query=${query}`);

    const safe = res.data.safeRecipes || [];
    const unsafe = res.data.unsafeRecipes || [];

    const allRecipes = [
      ...safe.map(r => ({ ...r, safe: true })),
      ...unsafe.map(r => ({ ...r, safe: false }))
    ];

    setRecipes(allRecipes);
  } catch (err) {
    console.error("Search failed:", err.response?.data || err.message);
    alert("Failed to search recipes ❌");
  } finally {
    setLoading(false);
  }
};


  // 📄 Get recipe details
  const viewDetails = async (id) => {
    try {
      const res = await recipeApi.get(`/recipes/${id}`);
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Details failed:", err.response?.data || err.message);
      alert("Failed to fetch recipe details ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍽️ Recipe Search</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="Search recipe (e.g. pasta)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ padding: "10px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={search} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recipes.map(r => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "260px",
              borderRadius: "12px",
              background: r.safe ? "#e8fff0" : "#ffe8e8"
            }}
          >
            <img
              src={r.image}
              alt={r.title}
              width="100%"
              style={{ borderRadius: "10px" }}
            />

            <h4>{r.title}</h4>

            <p style={{ fontSize: "13px", fontWeight: "bold" }}>
              {r.safe ? "✅ Safe Recipe" : "⚠️ Unsafe (Allergy Risk)"}
            </p>

            {!r.safe && r.dangerIngredients && (
              <p style={{ color: "red", fontSize: "12px" }}>
                Danger: {r.dangerIngredients.join(", ")}
              </p>
            )}

            <button onClick={() => viewDetails(r.id)}>
              📄 View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
