import { useEffect, useState, useCallback } from "react";
import api from "../api"; // ✅ use axios instance
import AppLayout from "../layouts/AppLayout";

export default function ShoppingList() {
  const [items, setItems] = useState([]);

  const loadShoppingList = useCallback(async () => {
    try {
      const res = await api.get("/shopping/list"); // ✅ no userId
      setItems(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load shopping list:",
        err.response?.data || err.message
      );
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
      link.setAttribute("download", "ShoppingList.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "PDF export failed:",
        err.response?.data || err.message
      );
    }
  };

  const removeItem = async (id) => {
  try {
    await api.delete(`/shopping/delete?id=${id}`);
    await loadShoppingList(); // ✅ refresh from backend
  } catch (err) {
    console.error(
      "Remove item failed:",
      err.response?.data || err.message
    );
  }
};


 const clearAll = async () => {
  try {
    await api.delete("/shopping/clear");
    await loadShoppingList(); // ✅ refresh from backend
  } catch (err) {
    console.error(
      "Clear all failed:",
      err.response?.data || err.message
    );
  }
};


  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>🛒 Shopping List</h2>

          {items.length === 0 && (
            <p style={styles.empty}>No ingredients found</p>
          )}

          {items.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <b>{item.ingredient}</b>
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
                Clear All
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
    width: "500px",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    marginBottom: "20px",
  },

  empty: {
    color: "#666",
    textAlign: "center",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  qty: {
    fontSize: "13px",
    color: "#555",
  },

  removeBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  clearBtn: {
    padding: "10px 14px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  pdfBtn: {
    padding: "10px 14px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
