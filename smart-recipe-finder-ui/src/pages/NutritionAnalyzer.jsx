import { useState } from "react";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function NutritionAnalyzer() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!food.trim()) {
      alert("Please enter some food");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formatted = food
  .split(/and|,|&/i) // supports and , &
  .map(x => x.trim())
  .filter(x => x.length > 0)
  .join("\n");


      // ✅ Send JSON (safe for backend)
      const res = await api.post("/nutrition/analyze", {
        food: formatted,
      });

      setResult(res.data || []);
    } catch (err) {
      console.error("❌ Nutrition failed:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        setError("Failed to analyze nutrition ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>🧪 Nutrition Analyzer</h1>
          <p style={styles.subtitle}>
            Enter food items like: <b>2 eggs and 4 banana</b>
          </p>

          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="e.g. 2 eggs and 4 banana"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              style={styles.input}
            />

            <button onClick={analyze} style={styles.button} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {loading && <p style={styles.loading}>⏳ Fetching nutrition...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {result.length > 0 && (
            <div style={styles.results}>
              {result.map((item, index) => (
                <div key={index} style={styles.foodCard}>
                  <h3 style={styles.foodTitle}>{item.name}</h3>

                  {item.nutrition?.nutrients
                    ?.filter((n) =>
                      ["Calories", "Carbohydrates", "Fat", "Protein"].includes(
                        n.name
                      )
                    )
                    .map((n) => (
                      <p key={n.name} style={styles.nutrient}>
                        <b>{n.name}:</b> {n.amount} {n.unit}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          )}

          {!loading && result.length === 0 && !error && (
            <p style={styles.empty}>No nutrition data yet 🥗</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },

  card: {
    background: "#fff",
    width: "900px",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    fontSize: "26px",
    marginBottom: "6px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "22px",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  button: {
    padding: "12px 20px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  loading: {
    marginTop: "12px",
    color: "#667eea",
  },

  error: {
    marginTop: "12px",
    color: "red",
  },

  empty: {
    marginTop: "15px",
    color: "#777",
  },

  results: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },

  foodCard: {
    background: "#f0f4ff",
    padding: "15px",
    borderRadius: "10px",
  },

  foodTitle: {
    marginBottom: "8px",
  },

  nutrient: {
    margin: "3px 0",
    fontSize: "14px",
  },
};
