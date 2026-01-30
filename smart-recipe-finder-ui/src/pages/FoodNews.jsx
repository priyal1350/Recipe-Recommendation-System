import { useEffect, useState } from "react";
import api from "../api"; // ✅ JWT axios instance
import AppLayout from "../layouts/AppLayout";

export default function FoodNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNews = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/ai/foodnews");

      setNews(res.data.articles || []);
    } catch (err) {
      console.error("❌ News fetch failed:", err.response?.data || err.message);
      setError("Failed to load food news 😔");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>📰 Latest Food & Health News</h1>

        {/* Loading */}
        {loading && <p style={styles.loading}>⏳ Loading latest news...</p>}

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Empty */}
        {!loading && !error && news.length === 0 && (
          <p style={styles.empty}>No news available right now 🥲</p>
        )}

        {/* News List */}
        <div style={styles.list}>
          {news.map((article, index) => (
            <div key={index} style={styles.card}>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  style={styles.image}
                />
              )}

              <div style={styles.content}>
                <h3 style={styles.newsTitle}>{article.title}</h3>
                <p style={styles.desc}>{article.description}</p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  Read full article →
                </a>
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
    padding: "30px",
    maxWidth: "1000px",
    margin: "auto",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    marginBottom: "20px",
    fontSize: "26px",
  },

  loading: {
    textAlign: "center",
    color: "#667eea",
    fontSize: "15px",
  },

  error: {
    textAlign: "center",
    color: "red",
    fontSize: "15px",
  },

  empty: {
    textAlign: "center",
    color: "#777",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    display: "flex",
    gap: "15px",
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
    transition: "transform 0.15s ease",
  },

  image: {
    width: "160px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  content: {
    flex: 1,
  },

  newsTitle: {
    marginBottom: "6px",
    fontSize: "17px",
  },

  desc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  },

  link: {
    fontSize: "14px",
    color: "#667eea",
    fontWeight: "bold",
    textDecoration: "none",
  },
};
