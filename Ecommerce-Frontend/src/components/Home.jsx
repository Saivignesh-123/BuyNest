import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "axios";

const Home = () => {
  const { data, addToCart, user } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedId, setAddedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ["All", "Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const updated = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product/${product.id}/image`,
              { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(response.data);
            return { ...product, imageUrl };
          } catch {
            return { ...product, imageUrl: null };
          }
        })
      );
      setProducts(updated);
      setFilteredProducts(updated);
    };
    if (data.length > 0) fetchImages();
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  }, [location.search, products]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    await addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>✦ Premium Shopping Experience</div>
        <h1 style={styles.heroTitle}>
          Discover <span style={styles.heroAccent}>Amazing</span> Products
        </h1>
        <p style={styles.heroSubtitle}>
          Shop the latest tech, fashion, and more at unbeatable prices
        </p>
        <div style={styles.heroStats}>
          <div style={styles.stat}><strong style={styles.statNum}>500+</strong><span style={styles.statLabel}>Products</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><strong style={styles.statNum}>50+</strong><span style={styles.statLabel}>Brands</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><strong style={styles.statNum}>24/7</strong><span style={styles.statLabel}>Support</span></div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.categorySection}>
        <div style={styles.categoryRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              style={selectedCategory === cat ? styles.catBtnActive : styles.catBtn}
              onMouseEnter={e => {
                if (selectedCategory !== cat) {
                  e.target.style.borderColor = "#d4af37";
                  e.target.style.color = "#d4af37";
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== cat) {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.color = "rgba(255,255,255,0.7)";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Count */}
      <div style={styles.productsHeader}>
        <p style={styles.productsCount}>
          Showing <strong style={{ color: "#d4af37" }}>{filteredProducts.length}</strong> products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🛍️</div>
          <p style={styles.emptyText}>No products found</p>
          <p style={styles.emptySubtext}>Try a different category</p>
        </div>
      ) : (
        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={styles.card}
              onClick={() => navigate(`/product/${product.id}`)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
              }}
            >
              <div style={styles.imageWrapper}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>📦</div>
                )}
                <div style={styles.imageOverlay} />
                {product.productAvailable ? (
                  <span style={styles.badgeAvailable}>✓ In Stock</span>
                ) : (
                  <span style={styles.badgeUnavailable}>Out of Stock</span>
                )}
              </div>

              <div style={styles.cardContent}>
                <p style={styles.brand}>{product.brand}</p>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.category}>
                  <span style={styles.categoryDot} /> {product.category}
                </p>
                <div style={styles.cardDivider} />
                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.priceLabel}>Price</span>
                    <span style={styles.price}>₹{product.price?.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    style={
                      !product.productAvailable ? styles.addBtnDisabled
                        : addedId === product.id ? styles.addBtnSuccess
                        : styles.addBtn
                    }
                    disabled={!product.productAvailable}
                    onMouseEnter={e => {
                      if (product.productAvailable && addedId !== product.id) {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 8px 20px rgba(212,175,55,0.4)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 12px rgba(212,175,55,0.3)";
                    }}
                  >
                    {!product.productAvailable ? "Unavailable"
                      : addedId === product.id ? "✅ Added!"
                      : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0a0f 0%, #0d1117 50%, #0a0f1a 100%)",
    paddingTop: "70px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "80px 24px 60px",
    background: "linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 100%)",
    borderBottom: "1px solid rgba(212,175,55,0.1)",
    position: "relative",
  },
  heroBadge: {
    display: "inline-block",
    padding: "6px 20px",
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: "50px",
    color: "#d4af37",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "2px",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "clamp(32px, 5vw, 56px)",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 16px",
    letterSpacing: "-1.5px",
    lineHeight: "1.1",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #d4af37, #f9e077, #d4af37)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSubtitle: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 40px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6",
  },
  heroStats: {
    display: "inline-flex",
    alignItems: "center",
    gap: "32px",
    padding: "16px 40px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "100px",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  statNum: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#d4af37",
  },
  statLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  statDivider: {
    width: "1px",
    height: "30px",
    background: "rgba(212,175,55,0.2)",
  },
  categorySection: {
    padding: "28px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  categoryRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  catBtn: {
    padding: "9px 22px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "50px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "all 0.2s ease",
  },
  catBtnActive: {
    padding: "9px 22px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "50px",
    color: "#0a0a0f",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "700",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
  },
  productsHeader: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px 24px 0",
  },
  productsCount: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    margin: 0,
    letterSpacing: "0.3px",
  },
  grid: {
    display: "grid",
    gap: "20px",
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  imageWrapper: {
    position: "relative",
    height: "220px",
    background: "rgba(255,255,255,0.02)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 50%)",
  },
  noImage: { fontSize: "60px", zIndex: 1 },
  badgeAvailable: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(16,185,129,0.9)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    zIndex: 2,
  },
  badgeUnavailable: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(239,68,68,0.9)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: "700",
    zIndex: 2,
  },
  cardContent: { padding: "22px" },
  brand: {
    color: "#d4af37",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    margin: "0 0 8px",
  },
  productName: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 8px",
    lineHeight: "1.3",
  },
  category: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "12px",
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  categoryDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#d4af37",
    display: "inline-block",
    flexShrink: 0,
  },
  cardDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "0 0 16px",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  priceLabel: {
    display: "block",
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "2px",
  },
  price: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "800",
    display: "block",
  },
  addBtn: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "50px",
    color: "#0a0a0f",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
    whiteSpace: "nowrap",
  },
  addBtnSuccess: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    border: "none",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
    whiteSpace: "nowrap",
  },
  addBtnDisabled: {
    padding: "10px 18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50px",
    color: "rgba(255,255,255,0.2)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "not-allowed",
    fontFamily: "'Segoe UI', sans-serif",
    whiteSpace: "nowrap",
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 24px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    margin: 0,
  },
};

export default Home;