import { useEffect, useState } from "react";
import api from "../api";

function AllergyPage() {
  const [allergies, setAllergies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ✅ Load all allergies
        const allRes = await api.get("/allergy/all");
        const allAllergies = allRes.data || [];
        setAllergies(allAllergies);

        // ✅ Load user allergies
        const userRes = await api.get("/user/allergies");
        const userAllergies = userRes.data || [];

        // ✅ Normalize (string array or object array)
        const userNames = userAllergies.map(a =>
          typeof a === "string" ? a : a.name
        );

        const selectedIds = allAllergies
          .filter(a => userNames.includes(a.name))
          .map(a => a.allergyId);

        setSelected(selectedIds);
      } catch (err) {
        console.error("❌ Error loading allergies:", err);
        alert("Failed to load allergies. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleAllergy = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const saveAllergies = async () => {
    try {
      await api.post("/user/allergies", { allergyIds: selected });
      alert("✅ Allergies saved successfully!");

      // 🔥 Reload from backend
      const userRes = await api.get("/user/allergies");
      const userAllergies = userRes.data || [];

      const userNames = userAllergies.map(a =>
        typeof a === "string" ? a : a.name
      );

      const selectedIds = allergies
        .filter(a => userNames.includes(a.name))
        .map(a => a.allergyId);

      setSelected(selectedIds);

    } catch (err) {
      console.error("❌ Error saving allergies:", err);
      alert("Failed to save allergies ❌");
    }
  };

  if (loading) return <h3>⏳ Loading allergies...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "450px", margin: "auto" }}>
      <h2>🧬 Allergy Preferences</h2>

      {allergies.map(a => (
        <div key={a.allergyId} style={{ margin: "10px 0" }}>
          <label style={{ fontSize: "16px" }}>
            <input
              type="checkbox"
              checked={selected.includes(a.allergyId)}
              onChange={() => toggleAllergy(a.allergyId)}
            />
            <span style={{ marginLeft: "10px" }}>{a.name}</span>
          </label>
        </div>
      ))}

      <button
        onClick={saveAllergies}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Save Preferences ✅
      </button>
    </div>
  );
}

export default AllergyPage;
