import { useEffect, useState, useCallback } from "react";
import api from "../api";
import AppLayout from "../layouts/AppLayout";

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadShoppingList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/shopping/list");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load shopping list:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        setError("Failed to load shopping list ❌");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const exportPdf = async () => {
    try {
      const res = await api.get("/shopping/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ShoppingList.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err.response?.data || err.message);
      alert("Failed to download PDF ❌");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/shopping/delete?id=${id}`);
      await loadShoppingList();
    } catch (err) {
      console.error("Remove item failed:", err.response?.data || err.message);
      alert("Failed to remove item ❌");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear the entire shopping list?")) return;

    try {
      await api.delete("/shopping/clear");
      await loadShoppingList();
    } catch (err) {
      console.error("Clear all failed:", err.response?.data || err.message);
      alert("Failed to clear list ❌");
    }
  };

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>🛒 Shopping List</h2>

          {loading && <p style={styles.loading}>⏳ Loading your items...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {!loading && items.length === 0 && (
            <p style={styles.empty}>No ingredients in your shopping list 🧾</p>
          )}

          {items.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <b style={styles.itemName}>{item.ingredient}</b>
                <p style={styles.qty}>{item.quantity}</p>
              </div>

              <button
                style={styles.removeBtn}
                onClick={() => removeItem(item.id)}
              >
                ❌
              </button>
            </div>
          ))}

          {items.length > 0 && (
            <div style={styles.actions}>
              <button style={styles.clearBtn} onClick={clearAll}>
                🗑 Clear All
              </button>

              <button style={styles.pdfBtn} onClick={exportPdf}>
                📄 Download PDF
              </button>
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
    width: "520px",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
  },

  title: {
    marginBottom: "18px",
    fontSize: "24px",
  },

  loading: {
    color: "#667eea",
    marginBottom: "10px",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },

  empty: {
    color: "#777",
    textAlign: "center",
    fontSize: "15px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
    transition: "transform 0.15s ease",
  },

  itemName: {
    fontSize: "15px",
  },

  qty: {
    fontSize: "13px",
    color: "#555",
  },

  removeBtn: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "22px",
  },

  clearBtn: {
    padding: "10px 16px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  pdfBtn: {
    padding: "10px 16px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
