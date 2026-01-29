import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api"; // ✅ use JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function Home() {
  const navigate = useNavigate();
  const [foodFact, setFoodFact] = useState("");

  const logout = () => {
  localStorage.removeItem("token"); // ✅ remove JWT
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  navigate("/login");
};


  // ✅ Call .NET API with JWT
  useEffect(() => {
    api.get("/ai/foodfact")
      .then(res => {
        setFoodFact(res.data.text);
      })
      .catch(() => {
        setFoodFact("🥗 Eat fresh, stay fit, and fuel your body right!");
      });
  }, []);

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <h1 style={styles.header}>🍲 Smart Recipe Finder</h1>
          <p style={styles.tagline}>
            Discover recipes, track nutrition & plan meals intelligently
          </p>
        </div>

        <div style={styles.topButtons}>
  <button style={styles.navBtn} onClick={logout}>Logout</button>
  <button style={styles.navBtn} onClick={() => navigate("/favorites")}>❤️ Favorites</button>
  <button style={styles.navBtn} onClick={() => navigate("/ai-meal-planner")}>🤖 AI Planner</button>
  <button style={styles.navBtn} onClick={() => navigate("/nutrition")}>🧪 Nutrition</button>
  <button style={styles.navBtn} onClick={() => navigate("/shopping")}>🛒 Shopping</button>
  <button style={styles.navBtn} onClick={() => navigate("/filtered-recipes")}>🥗 Healthy Recipes</button>
  <button style={styles.navBtn} onClick={() => navigate("/cook-with-ingredients")}>
    🧺 Cook With Ingredients
  </button>
  <button style={styles.navBtn} onClick={() => navigate("/food-news")}>
    📰 Food News
  </button>
  <button style={styles.navBtn} onClick={() => navigate("/search-recipes")}>
    🔍 Search Recipes
  </button>
  <button style={styles.navBtn} onClick={() => navigate("/safe-recipes")}>
  🛡️ Safe Recipes
</button>

  {/* ⭐ NEW ALLERGY BUTTON */}
  <button style={styles.navBtn} onClick={() => navigate("/allergies")}>
    🧬 Allergies
  </button>
</div>


        <div style={styles.factCard}>
          <h3>🍽️ Daily Food Fact</h3>
          <p>{foodFact || "Loading today’s fact..."}</p>
        </div>
      </div>
    </AppLayout>
  );
}


const styles = {
  wrapper: {
    maxWidth: "1250px",
    margin: "auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
  },

factCard: {
  marginTop: "25px",
  background: "#f0f4ff",
  padding: "20px",
  borderRadius: "12px",
  fontSize: "14px",
  color: "#333",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
},


  hero: {
    marginBottom: "25px",
  },

  header: {
    fontSize: "34px",
    marginBottom: "6px",
  },

  tagline: {
    color: "#666",
    fontSize: "15px",
  },

  topButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "25px 0",
  },

  navBtn: {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid #ddd",
    background: "#f5f7fb",
    cursor: "pointer",
    fontSize: "14px",
  },

  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },

  input: {
    padding: "12px",
    flex: 1,
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  searchBtn: {
    padding: "12px 18px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  image: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "10px",
  },

  cardButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  popupOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  popup: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    width: "320px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
};

