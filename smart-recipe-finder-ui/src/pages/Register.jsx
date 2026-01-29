import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_API = "http://localhost:8081/api/auth"; // ✅ Spring Boot API

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    passwordHash: "", // ✅ MUST match backend field
    dietPreference: "",
    ageGroup: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    console.log("Register payload:", form); // ✅ debug

    if (!form.name || !form.email || !form.passwordHash) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${AUTH_API}/register`, form, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Registration successful 🎉");
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Create an Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        {/* ✅ FIXED: name MUST be passwordHash */}
        <input
          name="passwordHash"
          type="password"
          placeholder="Password"
          value={form.passwordHash}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="dietPreference"
          value={form.dietPreference}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Diet</option>
          <option value="veg">🌱 Vegetarian</option>
          <option value="nonveg">🍗 Non-Vegetarian</option>
        </select>

        <select
          name="ageGroup"
          value={form.ageGroup}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Age Group</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="50+">50+</option>
        </select>

        <button onClick={register} style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={styles.link} onClick={() => navigate("/login")}>
          Already have an account? Login →
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  link: {
    textAlign: "center",
    marginTop: "15px",
    color: "#007bff",
    cursor: "pointer"
  }
};
