import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, user } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product/${id}`);
        setProduct(response.data);
      } catch (error) { console.error("Error fetching product:", error); }
    };
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) { console.error("Error fetching image:", error); }
    };
    fetchProduct();
    fetchImage();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    await addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
      navigate("/");
    } catch (error) { console.error("Error deleting product:", error); }
  };

  if (!product) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content" style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Products
        </button>

        <div style={{ ...styles.layout, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

          {/* Left — Image */}
          <div style={styles.imageSection}>
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} style={styles.image} />
            ) : (
              <div style={styles.noImage}>📦</div>
            )}
            <div style={styles.badges}>
              <span style={product.productAvailable ? styles.badgeAvailable : styles.badgeUnavailable}>
                {product.productAvailable ? "✅ In Stock" : "❌ Out of Stock"}
              </span>
              <span style={styles.badgeCategory}>{product.category}</span>
            </div>
          </div>

          {/* Right — Details */}
          <div style={styles.detailsSection}>
            <p style={styles.brand}>{product.brand}</p>
            <h1 style={styles.name}>{product.name}</h1>

            <div style={styles.metaRow}>
              <span style={styles.metaItem}>📅 Listed: {new Date(product.releaseDate).toLocaleDateString()}</span>
              <span style={styles.metaItem}>📦 Stock: {product.stockQuantity}</span>
            </div>

            <div style={styles.descriptionBox}>
              <p style={styles.descriptionLabel}>📋 Description</p>
              <p style={styles.descriptionText}>{product.description}</p>
            </div>

            <div style={styles.priceRow}>
              <span style={styles.price}>₹{product.price}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
              style={product.productAvailable ? (added ? styles.addedBtn : styles.addBtn) : styles.disabledBtn}
            >
              {added ? "✅ Added to Cart!" : product.productAvailable ? "🛒 Add to Cart" : "Out of Stock"}
            </button>

            {user?.role === "ROLE_ADMIN" && (
              <div style={styles.adminBtns}>
                <button onClick={() => navigate(`/product/update/${id}`)} style={styles.editBtn}>
                  ✏️ Edit Product
                </button>
                <button onClick={handleDelete} style={styles.deleteBtn}>
                  🗑️ Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0a0f 0%, #0d1117 50%, #0a0f1a 100%)",
    paddingTop: "90px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" },
  loadingPage: {
    minHeight: "100vh", background: "#0a0a0f",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loadingText: { color: "#fff", fontSize: "24px" },
  backBtn: {
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "50px", color: "#d4af37",
    padding: "8px 20px", fontSize: "13px",
    cursor: "pointer", marginBottom: "32px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  layout: { display: "grid", gap: "48px", alignItems: "start" },
  imageSection: { position: "sticky", top: "90px" },
  image: {
    width: "100%", borderRadius: "24px", objectFit: "cover",
    maxHeight: "450px", border: "1px solid rgba(212,175,55,0.12)",
  },
  noImage: {
    width: "100%", height: "400px",
    background: "rgba(212,175,55,0.04)", borderRadius: "24px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "80px", border: "1px solid rgba(212,175,55,0.1)",
  },
  badges: { display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" },
  badgeAvailable: {
    background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
    color: "#10b981", padding: "6px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: "600",
  },
  badgeUnavailable: {
    background: "rgba(255,77,77,0.2)", border: "1px solid rgba(255,77,77,0.4)",
    color: "#ff6b6b", padding: "6px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: "600",
  },
  badgeCategory: {
    background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)",
    color: "#d4af37", padding: "6px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: "600",
  },
  detailsSection: { display: "flex", flexDirection: "column", gap: "16px" },
  brand: {
    color: "#d4af37", fontSize: "13px", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: "2px", margin: 0,
  },
  name: { color: "#ffffff", fontSize: "32px", fontWeight: "800", margin: 0, lineHeight: "1.2" },
  metaRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
  metaItem: { color: "rgba(255,255,255,0.5)", fontSize: "13px" },
  descriptionBox: {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.1)",
    borderRadius: "16px", padding: "20px",
  },
  descriptionLabel: {
    color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px",
  },
  descriptionText: { color: "#ffffff", fontSize: "15px", lineHeight: "1.6", margin: 0 },
  priceRow: { display: "flex", alignItems: "center", gap: "16px" },
  price: { color: "#d4af37", fontSize: "40px", fontWeight: "800" },
  addBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "14px",
    color: "#0a0a0f", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 8px 25px rgba(212,175,55,0.35)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  addedBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    border: "none", borderRadius: "14px",
    color: "#ffffff", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 8px 25px rgba(16,185,129,0.4)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  disabledBtn: {
    width: "100%", padding: "16px",
    background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "14px",
    color: "rgba(255,255,255,0.3)", fontSize: "16px", fontWeight: "700",
    cursor: "not-allowed", fontFamily: "'Segoe UI', sans-serif",
  },
  adminBtns: { display: "flex", gap: "12px", marginTop: "8px" },
  editBtn: {
    flex: 1, padding: "12px",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "12px", color: "#d4af37",
    fontSize: "14px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
  deleteBtn: {
    flex: 1, padding: "12px",
    background: "rgba(255,77,77,0.15)", border: "1px solid rgba(255,77,77,0.3)",
    borderRadius: "12px", color: "#ff6b6b",
    fontSize: "14px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
};

export default Product;