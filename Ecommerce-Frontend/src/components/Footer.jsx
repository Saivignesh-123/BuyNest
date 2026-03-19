import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Top */}
        <div className="footer-top" style={styles.top}>

          {/* Brand */}
          <div style={styles.brand}>
            <h2 style={styles.logo}>🛍️ BuyNest</h2>
            <p style={styles.tagline}>
              Your premium shopping destination for the latest tech, fashion, and more.
            </p>
            <div style={styles.socialRow}>
              <a href="#" style={styles.socialBtn}>GitHub</a>
              <a href="#" style={styles.socialBtn}>LinkedIn</a>
              <a href="#" style={styles.socialBtn}>Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksCol}>
            <h3 style={styles.colTitle}>Quick Links</h3>
            <div style={styles.linksRow}>
              <Link to="/" style={styles.link}>🏠 Home</Link>
              <Link to="/cart" style={styles.link}>🛒 Cart</Link>
              <Link to="/orders" style={styles.link}>📋 My Orders</Link>
              <Link to="/register" style={styles.link}>📝 Register</Link>
              <Link to="/login" style={styles.link}>🔐 Login</Link>
            </div>
          </div>

          {/* Categories */}
          <div style={styles.linksCol}>
            <h3 style={styles.colTitle}>Categories</h3>
            <div style={styles.linksRow}>
              <Link to="/?category=Mobile" style={styles.link}>📱 Mobile</Link>
              <Link to="/?category=Laptop" style={styles.link}>💻 Laptop</Link>
              <Link to="/?category=Headphone" style={styles.link}>🎧 Headphone</Link>
              <Link to="/?category=Electronics" style={styles.link}>⚡ Electronics</Link>
              <Link to="/?category=Fashion" style={styles.link}>👗 Fashion</Link>
              <Link to="/?category=Toys" style={styles.link}>🧸 Toys</Link>
            </div>
          </div>

        </div>

        <div style={styles.divider} />

        {/* Bottom */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © 2026 BuyNest. Built by <span style={styles.highlight}>C Sai Vignesh</span>
          </p>
          <p style={styles.rights}>All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "rgba(10,10,15,0.98)",
    borderTop: "1px solid rgba(212,175,55,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "60px",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "40px 24px 24px",
  },
  top: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr",
    gap: "32px",
    marginBottom: "32px",
  },
  brand: {},
  logo: {
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 10px",
  },
  tagline: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0 0 16px",
    maxWidth: "260px",
  },
  socialRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  socialBtn: {
    padding: "5px 12px",
    background: "rgba(212,175,55,0.07)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "50px",
    color: "#d4af37",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
  },
  linksCol: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  colTitle: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  linksRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  link: {
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    fontSize: "13px",
    padding: "4px 10px",
    background: "rgba(212,175,55,0.05)",
    border: "1px solid rgba(212,175,55,0.1)",
    borderRadius: "50px",
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    background: "rgba(212,175,55,0.1)",
    marginBottom: "20px",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  copyright: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "13px",
    margin: 0,
  },
  highlight: {
    color: "#d4af37",
    fontWeight: "600",
  },
  rights: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "13px",
    margin: 0,
  },
};

export default Footer;