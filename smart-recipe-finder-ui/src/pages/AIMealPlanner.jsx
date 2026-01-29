import { useState } from "react";
import axios from "axios";
import AppLayout from "../layouts/AppLayout";

const API_BASE = "https://localhost:7060/api";

export default function AiMealPlanner() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!goal.trim()) {
      alert("Please enter your fitness goal");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/ai/mealplan`,
        { goal },
        { headers: { "Content-Type": "application/json" } }
      );

      const text =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setPlan(text);
    } catch (err) {
      console.error("Error generating plan:", err.response?.data || err.message);
      alert("Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>🤖 AI Meal Planner</h1>
          <p style={styles.subtitle}>
            Generate a personalized Indian meal plan based on your fitness goal
          </p>

          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="fat loss / muscle gain"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={styles.input}
            />

            <button onClick={generatePlan} style={styles.button}>
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>

          {loading && (
            <p style={styles.loading}>⏳ Creating your meal plan...</p>
          )}

          {plan && (
            <div style={styles.output}>
              <h2 style={styles.outputTitle}>🍽️ Your Meal Plan</h2>

              {plan.split("###").map((block, index) => {
                const lines = block.trim().split("\n").filter(Boolean);
                if (!lines.length) return null;

                const dayTitle = lines[0].replace(/\*/g, "").trim();

                return (
                  <div key={index} style={styles.dayCard}>
                    <h3 style={styles.dayTitle}>📅 {dayTitle}</h3>

                    {lines.slice(1).map((line, i) => (
                      <p key={i} style={styles.mealLine}>
                        {line.replace(/\*\*/g, "").trim()}
                      </p>
                    ))}
                  </div>
                );
              })}
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
    borderRadius: "14px",
    padding: "30px",
    width: "900px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
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
    padding: "12px 18px",
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

  output: {
    marginTop: "30px",
    padding: "20px",
    background: "#f0f4ff",
    borderRadius: "12px",
  },

  outputTitle: {
    marginBottom: "15px",
  },

  dayCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  dayTitle: {
    marginBottom: "8px",
  },

  mealLine: {
    fontSize: "14px",
    color: "#333",
    margin: "3px 0",
    lineHeight: "1.6",
  },
};
