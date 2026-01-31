import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    dietPreference: "",
    ageGroup: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ✅ Validation Function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!form.passwordHash) {
      newErrors.passwordHash = "Password is required";
    } else if (!passwordRegex.test(form.passwordHash)) {
      newErrors.passwordHash =
        "Password must be 8+ chars, uppercase, lowercase, number & special character";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.passwordHash !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Dropdown validation
    if (!form.dietPreference) {
      newErrors.dietPreference = "Please select diet preference";
    }

    if (!form.ageGroup) {
      newErrors.ageGroup = "Please select age group";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        passwordHash: form.passwordHash,
        dietPreference: form.dietPreference,
        ageGroup: form.ageGroup
      };

      await authApi.post("/auth/register", payload);

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
        {errors.name && <p style={styles.error}>{errors.name}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input
          name="passwordHash"
          type="password"
          placeholder="Password"
          value={form.passwordHash}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.passwordHash && <p style={styles.error}>{errors.passwordHash}</p>}

        {/* ✅ Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.confirmPassword && (
          <p style={styles.error}>{errors.confirmPassword}</p>
        )}

        <select
          name="dietPreference"
          value={form.dietPreference}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Diet</option>
          <option value="veg">🌱 Vegetarian</option>
          <option value="nonveg">🍗 Non-Vegetarian</option>
          <option value="vegan">🥗 Vegan</option>
        </select>
        {errors.dietPreference && (
          <p style={styles.error}>{errors.dietPreference}</p>
        )}

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
        {errors.ageGroup && <p style={styles.error}>{errors.ageGroup}</p>}

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
     background: "linear-gradient(135deg, #667eea, #764ba2)",
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
    marginBottom: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "10px"
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
