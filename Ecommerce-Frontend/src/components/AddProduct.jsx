import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const AddProduct = () => {
  const { refreshData } = useContext(AppContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) { alert("Please select an image!"); return; }
    setLoading(true);

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      const t = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${t}`,
        },
      });
      await refreshData();
      alert("Product added successfully! ✅");
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>➕ Add New Product</h1>
          <p style={styles.subtitle}>Fill in the details to add a product to the store</p>
        </div>

        <form onSubmit={submitHandler} style={styles.form}>
          <div style={{
            ...styles.grid,
            gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
          }}>

            {/* Left Column */}
            <div style={styles.leftCol}>
              <div style={styles.imageUploadBox}>
                {preview ? (
                  <img src={preview} alt="preview" style={styles.previewImg} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <p style={styles.uploadIcon}>📷</p>
                    <p style={styles.uploadText}>Click to upload image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                  required
                />
              </div>

              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="productAvailable"
                  checked={product.productAvailable}
                  onChange={(e) => setProduct({ ...product, productAvailable: e.target.checked })}
                  style={styles.checkbox}
                />
                <label htmlFor="productAvailable" style={styles.checkboxLabel}>
                  ✅ Product Available
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.rightCol}>
              <div style={{
                ...styles.row,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Product Name</label>
                  <input type="text" name="name" value={product.name} onChange={handleInputChange}
                    placeholder="e.g. iPhone 15 Pro" style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Brand</label>
                  <input type="text" name="brand" value={product.brand} onChange={handleInputChange}
                    placeholder="e.g. Apple" style={styles.input} required />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea name="description" value={product.description} onChange={handleInputChange}
                  placeholder="Describe the product..." style={styles.textarea} rows={3} required />
              </div>

              <div style={{
                ...styles.row,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              }}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (₹)</label>
                  <input type="number" name="price" value={product.price} onChange={handleInputChange}
                    placeholder="e.g. 49999" style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleInputChange}
                    placeholder="e.g. 100" style={styles.input} required />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select name="category" value={product.category} onChange={handleInputChange}
                    style={styles.select} required>
                    <option value="">Select category</option>
                    <option value="Laptop">💻 Laptop</option>
                    <option value="Headphone">🎧 Headphone</option>
                    <option value="Mobile">📱 Mobile</option>
                    <option value="Electronics">⚡ Electronics</option>
                    <option value="Toys">🧸 Toys</option>
                    <option value="Fashion">👗 Fashion</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Release Date</label>
                  <input type="date" name="releaseDate" value={product.releaseDate}
                    onChange={handleInputChange} style={styles.input} required />
                </div>
              </div>

              <div style={styles.btnRow}>
                <button type="button" onClick={() => navigate("/")} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={loading ? styles.submitBtnDisabled : styles.submitBtn} disabled={loading}>
                  {loading ? "Adding..." : "➕ Add Product"}
                </button>
              </div>
            </div>
          </div>
        </form>
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
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 24px 60px",
  },
  header: { marginBottom: "32px" },
  title: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    margin: 0,
  },
  form: {
    background: "rgba(212,175,55,0.04)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "24px",
    padding: "32px",
    width: "100%",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gap: "32px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  imageUploadBox: {
    position: "relative",
    height: "280px",
    background: "rgba(212,175,55,0.04)",
    border: "2px dashed rgba(212,175,55,0.25)",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  uploadPlaceholder: { textAlign: "center" },
  uploadIcon: { fontSize: "48px", margin: "0 0 8px" },
  uploadText: { color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 },
  fileInput: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    opacity: 0, cursor: "pointer",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "rgba(212,175,55,0.05)",
    border: "1px solid rgba(212,175,55,0.12)",
    borderRadius: "12px",
  },
  checkbox: { width: "18px", height: "18px", cursor: "pointer" },
  checkboxLabel: { color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  rightCol: { display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Segoe UI', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  },
  btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
  cancelBtn: {
    padding: "12px 24px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  submitBtn: {
    flex: 1,
    padding: "12px 24px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    borderRadius: "12px",
    color: "#0a0a0f",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 8px 25px rgba(212,175,55,0.35)",
  },
  submitBtnDisabled: {
    flex: 1,
    padding: "12px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "not-allowed",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default AddProduct;