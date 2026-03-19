import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart, clearCart, user } = useContext(AppContext);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setOrdering(true);
    try {
      const t = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/orders/${user.username}`,
        {},
        { headers: { Authorization: `Bearer ${t}` } }
      );
      await clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order!");
    } finally {
      setOrdering(false);
    }
  };

  if (!user) {
    return (
      <div className="page-content" style={styles.page}>
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🔒</p>
          <h2 style={styles.emptyTitle}>Please Login First</h2>
          <p style={styles.emptySubtext}>You need to login to view your cart</p>
          <button onClick={() => navigate("/login")} style={styles.shopBtn}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🎉</p>
          <h2 style={styles.emptyTitle}>Order Placed Successfully!</h2>
          <p style={styles.emptySubtext}>Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🛒</p>
          <h2 style={styles.emptyTitle}>Your Cart is Empty</h2>
          <p style={styles.emptySubtext}>Add some products to get started!</p>
          <button onClick={() => navigate("/")} style={styles.shopBtn}>Start Shopping</button>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛒 Your Cart</h1>
          <p style={styles.subtitle}>{cart.length} item{cart.length > 1 ? "s" : ""}</p>
        </div>

        <div className="cart-layout" style={styles.layout}>
          <div style={styles.itemsSection}>
            {cart.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.productIcon}>📦</div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{item.productName || item.name}</h3>
                    <p style={styles.productPrice}>₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
                <div style={styles.cardRight}>
                  <span style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.productId || item.id)} style={styles.removeBtn}>🗑️</button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} style={styles.clearBtn}>🗑️ Clear Cart</button>
          </div>

          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal</span>
              <span style={styles.summaryValue}>₹{total.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span style={styles.summaryValueGreen}>Free</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax (18%)</span>
              <span style={styles.summaryValue}>₹{(total * 0.18).toFixed(2)}</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.summaryRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>₹{(total + total * 0.18).toFixed(2)}</span>
            </div>
            <button onClick={handlePlaceOrder} disabled={ordering}
              style={ordering ? styles.checkoutBtnDisabled : styles.checkoutBtn}>
              {ordering ? "Placing Order..." : "🎉 Place Order"}
            </button>
            <button onClick={() => navigate("/orders")} style={styles.ordersBtn}>📋 My Orders</button>
            <button onClick={() => navigate("/")} style={styles.continueBtn}>← Continue Shopping</button>
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
  header: { marginBottom: "32px" },
  title: { color: "#ffffff", fontSize: "32px", fontWeight: "800", margin: "0 0 4px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  itemsSection: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "16px", padding: "20px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  cardLeft: { display: "flex", alignItems: "center", gap: "16px" },
  productIcon: {
    fontSize: "40px", width: "60px", height: "60px",
    background: "rgba(212,175,55,0.06)", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  productInfo: {},
  productName: { color: "#ffffff", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" },
  productPrice: { color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 },
  cardRight: { display: "flex", alignItems: "center", gap: "16px" },
  itemTotal: { color: "#d4af37", fontSize: "18px", fontWeight: "700" },
  removeBtn: {
    background: "rgba(255,77,77,0.15)", border: "1px solid rgba(255,77,77,0.2)",
    borderRadius: "10px", padding: "8px 12px", cursor: "pointer", fontSize: "16px", color: "#ffffff",
  },
  clearBtn: {
    background: "transparent", border: "1px solid rgba(255,77,77,0.3)",
    borderRadius: "12px", color: "#ff6b6b", padding: "10px 20px",
    fontSize: "13px", cursor: "pointer", fontWeight: "600",
    alignSelf: "flex-start", marginTop: "8px", fontFamily: "'Segoe UI', sans-serif",
  },
  summary: {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "20px", padding: "28px",
    position: "sticky", top: "90px",
  },
  summaryTitle: { color: "#ffffff", fontSize: "18px", fontWeight: "700", margin: "0 0 24px" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "14px" },
  summaryLabel: { color: "rgba(255,255,255,0.5)", fontSize: "14px" },
  summaryValue: { color: "#ffffff", fontSize: "14px", fontWeight: "600" },
  summaryValueGreen: { color: "#10b981", fontSize: "14px", fontWeight: "600" },
  divider: { height: "1px", background: "rgba(212,175,55,0.1)", margin: "16px 0" },
  totalLabel: { color: "#ffffff", fontSize: "16px", fontWeight: "700" },
  totalValue: { color: "#d4af37", fontSize: "20px", fontWeight: "800" },
  checkoutBtn: {
    width: "100%", padding: "15px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "12px",
    color: "#0a0a0f", fontSize: "15px", fontWeight: "700",
    cursor: "pointer", marginTop: "20px",
    boxShadow: "0 8px 25px rgba(212,175,55,0.35)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  checkoutBtnDisabled: {
    width: "100%", padding: "15px",
    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "12px",
    color: "rgba(255,255,255,0.4)", fontSize: "15px", fontWeight: "700",
    cursor: "not-allowed", marginTop: "20px", fontFamily: "'Segoe UI', sans-serif",
  },
  ordersBtn: {
    width: "100%", padding: "12px",
    background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "12px", color: "#d4af37",
    fontSize: "14px", cursor: "pointer", marginTop: "10px",
    fontWeight: "600", fontFamily: "'Segoe UI', sans-serif",
  },
  continueBtn: {
    width: "100%", padding: "12px", background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px",
    color: "rgba(255,255,255,0.6)", fontSize: "14px",
    cursor: "pointer", marginTop: "10px", fontFamily: "'Segoe UI', sans-serif",
  },
  emptyState: { textAlign: "center", padding: "120px 24px" },
  emptyIcon: { fontSize: "64px", margin: "0 0 16px" },
  emptyTitle: { color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 8px" },
  emptySubtext: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 24px" },
  shopBtn: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "50px",
    color: "#0a0a0f", fontSize: "14px", fontWeight: "700",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
};

export default Cart;