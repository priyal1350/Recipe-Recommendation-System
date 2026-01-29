import { useState } from "react";
import axios from "axios";
import AppLayout from "../layouts/AppLayout";

const API_BASE = "https://localhost:7060/api";

export default function NutritionAnalyzer() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!food.trim()) {
      alert("Please enter some food");
      return;
    }

    try {
      setLoading(true);

      const formatted = food
        .split("and")
        .map((x) => x.trim())
        .join("\n");

      const res = await axios.post(
        `${API_BASE}/nutrition/analyze`,
        formatted,
        { headers: { "Content-Type": "application/json" } }
      );

      setResult(res.data);
    } catch (err) {
      console.error(
        "Nutrition failed:",
        err.response?.data || err.message
      );
      alert("Nutrition info failed ❌");
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

            <button onClick={analyze} style={styles.button}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {loading && (
            <p style={styles.loading}>⏳ Fetching nutrition...</p>
          )}

          {result && (
            <div style={styles.results}>
              {result.map((item) => (
                <div key={item.id} style={styles.foodCard}>
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
