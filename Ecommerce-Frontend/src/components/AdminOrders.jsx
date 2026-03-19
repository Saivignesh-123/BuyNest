import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const AdminOrders = () => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const t = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/admin/orders`,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const t = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/admin/orders/${orderId}/status?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${t}` } }
      );
      fetchAllOrders();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING": return styles.statusPending;
      case "CONFIRMED": return styles.statusConfirmed;
      case "DELIVERED": return styles.statusDelivered;
      case "CANCELLED": return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="page-content" style={styles.page}>
        <div style={styles.loadingState}>
          <p style={styles.loadingText}>Loading all orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <h1 style={styles.title}>👑 Admin — All Orders</h1>
          <p style={styles.subtitle}>{orders.length} total orders</p>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{orders.length}</p>
            <p style={styles.statLabel}>Total Orders</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{orders.filter(o => o.status === "PENDING").length}</p>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{orders.filter(o => o.status === "DELIVERED").length}</p>
            <p style={styles.statLabel}>Delivered</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>₹{totalRevenue.toFixed(0)}</p>
            <p style={styles.statLabel}>Revenue</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📦</p>
            <h2 style={styles.emptyTitle}>No Orders Yet</h2>
            <p style={styles.emptySubtext}>Orders will appear here when users place them</p>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <p style={styles.orderId}>Order #{order.id}</p>
                    <p style={styles.orderUser}>👤 {order.username}</p>
                    <p style={styles.orderDate}>
                      📅 {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        year: "numeric", month: "long", day: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div style={styles.orderHeaderRight}>
                    <span style={getStatusStyle(order.status)}>{order.status}</span>
                    <p style={styles.orderTotal}>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div style={styles.itemsList}>
                  {order.items.map((item) => (
                    <div key={item.id} style={styles.orderItem}>
                      <span style={styles.itemIcon}>📦</span>
                      <span style={styles.itemName}>{item.productName}</span>
                      <span style={styles.itemQty}>x{item.quantity}</span>
                      <span style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.status !== "CANCELLED" && (
                  <div style={styles.statusBtns}>
                    <p style={styles.updateLabel}>Update Status:</p>
                    <div style={styles.btnRow}>
                      {["PENDING", "CONFIRMED", "DELIVERED"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order.id, s)}
                          style={order.status === s ? styles.statusBtnActive : styles.statusBtnInactive}
                        >
                          {s === "PENDING" ? "⏳" : s === "CONFIRMED" ? "✅" : "🚚"} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
  container: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px 60px" },
  header: { marginBottom: "24px" },
  title: { color: "#ffffff", fontSize: "32px", fontWeight: "800", margin: "0 0 4px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 },
  loadingState: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" },
  loadingText: { color: "#ffffff", fontSize: "18px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
  },
  statValue: { color: "#d4af37", fontSize: "28px", fontWeight: "800", margin: "0 0 4px" },
  statLabel: { color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: 0, textTransform: "uppercase", letterSpacing: "1px" },
  emptyState: { textAlign: "center", padding: "80px 24px" },
  emptyIcon: { fontSize: "64px", margin: "0 0 16px" },
  emptyTitle: { color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 8px" },
  emptySubtext: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 },
  ordersList: { display: "flex", flexDirection: "column", gap: "20px" },
  orderCard: {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "20px",
    padding: "24px",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(212,175,55,0.08)",
  },
  orderId: { color: "#ffffff", fontSize: "16px", fontWeight: "700", margin: "0 0 4px" },
  orderUser: { color: "#d4af37", fontSize: "14px", fontWeight: "600", margin: "0 0 4px" },
  orderDate: { color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 },
  orderHeaderRight: { textAlign: "right" },
  orderTotal: { color: "#ffffff", fontSize: "20px", fontWeight: "800", margin: "8px 0 0" },
  statusPending: {
    background: "rgba(255,193,7,0.2)", border: "1px solid rgba(255,193,7,0.4)",
    color: "#ffc107", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600",
  },
  statusConfirmed: {
    background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)",
    color: "#d4af37", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600",
  },
  statusDelivered: {
    background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
    color: "#10b981", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600",
  },
  statusCancelled: {
    background: "rgba(255,77,77,0.2)", border: "1px solid rgba(255,77,77,0.4)",
    color: "#ff6b6b", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600",
  },
  itemsList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  orderItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px",
  },
  itemIcon: { fontSize: "20px" },
  itemName: { color: "#ffffff", fontSize: "14px", fontWeight: "500", flex: 1 },
  itemQty: { color: "rgba(255,255,255,0.5)", fontSize: "13px" },
  itemPrice: { color: "#ffffff", fontSize: "14px", fontWeight: "700" },
  statusBtns: { marginTop: "8px" },
  updateLabel: { color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" },
  btnRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  statusBtnActive: {
    padding: "6px 14px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none", borderRadius: "50px",
    color: "#0a0a0f", fontSize: "12px", fontWeight: "700",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
  statusBtnInactive: {
    padding: "6px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "50px", color: "rgba(255,255,255,0.6)",
    fontSize: "12px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
};

export default AdminOrders;