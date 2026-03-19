import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = () => {
  const { cart, user, logout } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target))
        setShowCategories(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/products/search?keyword=${value}`
        );
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const cartCount = cart.length;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>

          {/* Logo */}
          <Link to="/" style={styles.logo} onClick={closeMobileMenu}>
            🛍️ BuyNest
          </Link>

          {/* Search — hidden on mobile */}
          {!isMobile && (
            <div style={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search products..."
                value={input}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                style={styles.searchInput}
              />
              <span style={styles.searchIcon}>🔍</span>
              {showResults && searchResults.length > 0 && (
                <div style={styles.searchDropdown}>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      to={`/product/${result.id}`}
                      style={styles.searchItem}
                      onClick={() => setShowResults(false)}
                    >
                      <span>🛒</span>
                      <span style={{ color: "#ffffff" }}>{result.name}</span>
                      <span style={styles.searchPrice}>₹{result.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Desktop Right Section */}
          {!isMobile && (
            <div style={styles.rightSection}>

              {/* Categories */}
              <div ref={categoriesRef} style={styles.dropdown}>
                <button
                  style={styles.dropBtn}
                  onClick={() => { setShowCategories(!showCategories); setShowUserMenu(false); }}
                >
                  📂 Categories ▾
                </button>
                {showCategories && (
                  <div style={styles.dropMenu}>
                    {["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"].map((cat) => (
                      <Link key={cat} to={`/?category=${cat}`} style={styles.dropItem}
                        onClick={() => setShowCategories(false)}>
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" style={styles.cartBtn}>
                🛒 Cart
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </Link>

              {/* Auth */}
              {user ? (
                <div ref={userMenuRef} style={styles.dropdown}>
                  <button style={styles.userBtn}
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowCategories(false); }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                      <span>👤 {user.username} ▾</span>
                      {user.role === "ROLE_ADMIN" && (
                        <span style={{ fontSize: "10px", color: "#0a0a0f", fontWeight: "700" }}>👑 Admin</span>
                      )}
                    </div>
                  </button>
                  {showUserMenu && (
                    <div style={styles.dropMenu}>
                      {user?.role === "ROLE_ADMIN" && (
                        <Link to="/add_product" style={styles.dropItem} onClick={() => setShowUserMenu(false)}>
                          ➕ Add Product
                        </Link>
                      )}
                      {user?.role === "ROLE_ADMIN" && (
                        <Link to="/admin/orders" style={styles.dropItem} onClick={() => setShowUserMenu(false)}>
                          👑 All Orders
                        </Link>
                      )}
                      <Link to="/orders" style={styles.dropItem} onClick={() => setShowUserMenu(false)}>
                        📋 My Orders
                      </Link>
                      <button onClick={handleLogout} style={styles.logoutItem}>
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.authBtns}>
                  <Link to="/login" style={styles.loginBtn}>Login</Link>
                  <Link to="/register" style={styles.registerBtn}>Register</Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Right — Cart + Hamburger */}
          {isMobile && (
            <div style={styles.mobileRight}>
              <Link to="/cart" style={styles.cartBtn}>
                🛒
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </Link>
              <button
                style={styles.hamburger}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          )}

        </div>

        {/* Mobile Search */}
        {isMobile && (
          <div style={styles.mobileSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={input}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              style={styles.mobileSearchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
            {showResults && searchResults.length > 0 && (
              <div style={styles.searchDropdown}>
                {searchResults.map((result) => (
                  <Link key={result.id} to={`/product/${result.id}`}
                    style={styles.searchItem} onClick={() => setShowResults(false)}>
                    <span>🛒</span>
                    <span style={{ color: "#ffffff" }}>{result.name}</span>
                    <span style={styles.searchPrice}>₹{result.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={styles.mobileMenu}>

          {/* User Info */}
          {user && (
            <div style={styles.mobileUserInfo}>
              <p style={styles.mobileUsername}>
                👤 {user.username}
              </p>
              <p style={styles.mobileRole}>
                {user.role === "ROLE_ADMIN" ? "👑 Admin" : "👤 User"}
              </p>
            </div>
          )}

          {/* Categories */}
          <p style={styles.mobileSectionTitle}>📂 Categories</p>
          <div style={styles.mobileCatGrid}>
            {["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"].map((cat) => (
              <Link key={cat} to={`/?category=${cat}`} style={styles.mobileCatBtn}
                onClick={closeMobileMenu}>
                {cat}
              </Link>
            ))}
          </div>

          <div style={styles.mobileDivider} />

          {/* Links */}
          {user ? (
            <>
              {user?.role === "ROLE_ADMIN" && (
                <Link to="/add_product" style={styles.mobileLink} onClick={closeMobileMenu}>
                  ➕ Add Product
                </Link>
              )}
              {user?.role === "ROLE_ADMIN" && (
                <Link to="/admin/orders" style={styles.mobileLink} onClick={closeMobileMenu}>
                  👑 All Orders
                </Link>
              )}
              <Link to="/orders" style={styles.mobileLink} onClick={closeMobileMenu}>
                📋 My Orders
              </Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <div style={styles.mobileAuthBtns}>
              <Link to="/login" style={styles.mobileLoginBtn} onClick={closeMobileMenu}>
                🔐 Login
              </Link>
              <Link to="/register" style={styles.mobileRegisterBtn} onClick={closeMobileMenu}>
                📝 Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    background: "rgba(10,10,15,0.97)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 24px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  searchWrapper: {
    flex: 1,
    position: "relative",
    maxWidth: "480px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 40px 10px 16px",
    background: "rgba(212,175,55,0.07)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  mobileSearch: {
    padding: "8px 16px 12px",
    position: "relative",
  },
  mobileSearchInput: {
    width: "100%",
    padding: "10px 40px 10px 16px",
    background: "rgba(212,175,55,0.07)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    right: "28px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    color: "#d4af37",
  },
  searchDropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0, right: 0,
    background: "#0d1117",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    zIndex: 200,
  },
  searchItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  searchPrice: {
    marginLeft: "auto",
    color: "#d4af37",
    fontWeight: "600",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "auto",
  },
  dropdown: { position: "relative" },
  dropBtn: {
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "50px",
    color: "#ffffff",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "'Segoe UI', sans-serif",
  },
  dropMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#0d1117",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "16px",
    overflow: "hidden",
    minWidth: "170px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
    zIndex: 200,
  },
  dropItem: {
    display: "block",
    padding: "12px 18px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  cartBtn: {
    position: "relative",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "50px",
    color: "#ffffff",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  cartBadge: {
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    color: "#0a0a0f",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userBtn: {
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "50px",
    color: "#0a0a0f",
    padding: "8px 14px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "700",
    fontFamily: "'Segoe UI', sans-serif",
    whiteSpace: "nowrap",
  },
  logoutItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    padding: "12px 18px",
    color: "#ff6b6b",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  authBtns: { display: "flex", gap: "8px" },
  loginBtn: {
    padding: "8px 16px",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: "50px",
    color: "#d4af37",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: "600",
  },
  registerBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "50px",
    color: "#0a0a0f",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: "700",
  },
  mobileRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "auto",
  },
  hamburger: {
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "10px",
    color: "#d4af37",
    padding: "8px 12px",
    fontSize: "18px",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  mobileMenu: {
    position: "fixed",
    top: "110px",
    left: 0, right: 0,
    background: "rgba(10,10,15,0.98)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
    padding: "20px 24px",
    zIndex: 999,
    maxHeight: "calc(100vh - 110px)",
    overflowY: "auto",
  },
  mobileUserInfo: {
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "16px",
  },
  mobileUsername: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 2px",
  },
  mobileRole: {
    color: "#d4af37",
    fontSize: "12px",
    margin: 0,
  },
  mobileSectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 10px",
  },
  mobileCatGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  mobileCatBtn: {
    padding: "6px 14px",
    background: "rgba(212,175,55,0.07)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "50px",
    color: "#d4af37",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: "500",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(212,175,55,0.1)",
    marginBottom: "16px",
  },
  mobileLink: {
    display: "block",
    padding: "14px 0",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  mobileLogout: {
    display: "block",
    width: "100%",
    padding: "14px 0",
    color: "#ff6b6b",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "8px",
  },
  mobileAuthBtns: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px",
  },
  mobileLoginBtn: {
    display: "block",
    padding: "14px",
    background: "rgba(212,175,55,0.07)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "12px",
    color: "#d4af37",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "center",
  },
  mobileRegisterBtn: {
    display: "block",
    padding: "14px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "12px",
    color: "#0a0a0f",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "center",
  },
};

export default Navbar;