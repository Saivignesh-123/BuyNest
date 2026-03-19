import React from "react";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>🛒 Checkout</h2>
          <button onClick={handleClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.item}>
              <img src={item.imageUrl} alt={item.name} style={styles.itemImg} />
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemQty}>Qty: {item.quantity}</p>
                <p style={styles.itemPrice}>₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>₹{totalPrice}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={handleClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleCheckout} style={styles.confirmBtn}>🎉 Confirm Purchase</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#0d1117",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: "20px",
    width: "90%", maxWidth: "500px",
    maxHeight: "80vh", overflow: "hidden",
    display: "flex", flexDirection: "column",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid rgba(212,175,55,0.1)",
  },
  title: { color: "#ffffff", fontSize: "20px", fontWeight: "700", margin: 0 },
  closeBtn: {
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px", color: "#ffffff", fontSize: "16px",
    cursor: "pointer", padding: "4px 10px",
  },
  body: { padding: "20px 24px", overflowY: "auto", flex: 1 },
  item: {
    display: "flex", gap: "14px", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  itemImg: { width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px" },
  itemInfo: {},
  itemName: { color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: "0 0 4px" },
  itemQty: { color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "0 0 2px" },
  itemPrice: { color: "#d4af37", fontSize: "14px", fontWeight: "700", margin: 0 },
  totalRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: "16px", padding: "16px",
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
  },
  totalLabel: { color: "#ffffff", fontSize: "16px", fontWeight: "700" },
  totalValue: { color: "#d4af37", fontSize: "22px", fontWeight: "800" },
  footer: {
    display: "flex", gap: "12px", padding: "20px 24px",
    borderTop: "1px solid rgba(212,175,55,0.1)",
  },
  cancelBtn: {
    flex: 1, padding: "12px",
    background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px", color: "rgba(255,255,255,0.6)",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  confirmBtn: {
    flex: 2, padding: "12px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "12px",
    color: "#0a0a0f", fontSize: "14px", fontWeight: "700",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 8px 25px rgba(212,175,55,0.35)",
  },
};

export default CheckoutPopup;