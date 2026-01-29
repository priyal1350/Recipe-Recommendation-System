import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../layouts/AppLayout";

export default function FoodNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7060/api/ai/foodnews")
      .then(res => setNews(res.data.articles || []))
      .catch(err => console.error("News fetch failed:", err));
  }, []);

  return (
    <AppLayout>
      <div style={styles.wrapper}>
        <h1>📰 Latest Food & Health News</h1>

        {news.length === 0 && <p>No news available right now.</p>}

        {news.map((article, index) => (
          <div key={index} style={styles.card}>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={styles.image}
              />
            )}

            <div>
              <h3>{article.title}</h3>
              <p>{article.description}</p>

              <a href={article.url} target="_blank" rel="noreferrer">
                Read full article →
              </a>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

const styles = {
  wrapper: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto"
  },
  card: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  image: {
    width: "140px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px"
  }
};
