import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Login = () => {
  const { login, user } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate("/"); }, [user]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>🛍️ BuyNest</h1>
          <p style={styles.tagline}>Your premium shopping destination</p>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input type="text" name="username" value={form.username}
              onChange={handleChange} placeholder="Enter your username"
              style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Enter your password"
              style={styles.input} required />
          </div>
          <button type="submit" style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0a0f 0%, #0d1117 50%, #0a0f1a 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(212,175,55,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "24px", padding: "48px 40px",
    width: "100%", maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  logoSection: { textAlign: "center", marginBottom: "32px" },
  logo: {
    fontSize: "32px", fontWeight: "800", margin: 0,
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  },
  tagline: { color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "4px 0 0" },
  title: { color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 8px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 32px" },
  inputGroup: { marginBottom: "20px" },
  label: {
    display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px",
    fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px",
  },
  input: {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "12px", color: "#fff", fontSize: "15px",
    outline: "none", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "15px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "12px",
    color: "#0a0a0f", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", marginTop: "8px",
    boxShadow: "0 8px 25px rgba(212,175,55,0.35)",
  },
  btnDisabled: {
    width: "100%", padding: "15px",
    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "12px",
    color: "rgba(255,255,255,0.5)", fontSize: "16px", fontWeight: "700",
    cursor: "not-allowed", marginTop: "8px",
  },
  error: {
    background: "rgba(255,77,77,0.15)", border: "1px solid rgba(255,77,77,0.3)",
    borderRadius: "10px", padding: "12px 16px",
    color: "#ff6b6b", fontSize: "14px", marginBottom: "20px",
  },
  registerText: { textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "24px" },
  link: { color: "#d4af37", textDecoration: "none", fontWeight: "600" },
};

export default Login;