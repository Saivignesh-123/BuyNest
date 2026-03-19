import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const UpdateProduct = () => {
  const { id } = useParams();
  const { refreshData } = useContext(AppContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API}/api/product/${id}`);
        setUpdateProduct(response.data);

        const responseImage = await axios.get(
          `${API}/api/product/${id}/image`,
          { responseType: "blob" }
        );

        const file = new File(
          [responseImage.data],
          response.data.imageName,
          { type: responseImage.data.type }
        );

        setImage(file);
        setPreview(URL.createObjectURL(responseImage.data));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const t = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("imageFile", image);
      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      await axios.put(`${API}/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${t}`,
        },
      });

      await refreshData();
      alert("Product updated successfully! ✅");
      navigate(`/product/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>✏️ Update Product</h1>
          <p style={styles.subtitle}>
            Edit the details below to update this product
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
            }}
          >
            {/* LEFT */}
            <div style={styles.leftCol}>
              <div style={styles.imageUploadBox}>
                {preview ? (
                  <img src={preview} alt="preview" style={styles.previewImg} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <p style={styles.uploadIcon}>📷</p>
                    <p style={styles.uploadText}>Upload Image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </div>

              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={updateProduct.productAvailable}
                  onChange={(e) =>
                    setUpdateProduct({
                      ...updateProduct,
                      productAvailable: e.target.checked,
                    })
                  }
                />
                <label style={styles.checkboxLabel}>
                  Product Available
                </label>
              </div>
            </div>

            {/* RIGHT */}
            <div style={styles.rightCol}>
              <div
                style={{
                  ...styles.row,
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                }}
              >
                <input
                  name="name"
                  value={updateProduct.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  style={styles.input}
                />
                <input
                  name="brand"
                  value={updateProduct.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  style={styles.input}
                />
              </div>

              <textarea
                name="description"
                value={updateProduct.description}
                onChange={handleChange}
                placeholder="Description"
                style={styles.textarea}
              />

              <div
                style={{
                  ...styles.row,
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                }}
              >
                <input
                  type="number"
                  name="price"
                  value={updateProduct.price}
                  onChange={handleChange}
                  placeholder="Price"
                  style={styles.input}
                />
                <input
                  type="number"
                  name="stockQuantity"
                  value={updateProduct.stockQuantity}
                  onChange={handleChange}
                  placeholder="Stock"
                  style={styles.input}
                />
              </div>

              <div
                style={{
                  ...styles.row,
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                }}
              >
                <select
                  name="category"
                  value={updateProduct.category}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Electronics">Electronics</option>
                </select>

                <input
                  type="date"
                  name="releaseDate"
                  value={
                    updateProduct.releaseDate
                      ? updateProduct.releaseDate.split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.btnRow}>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${id}`)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={loading ? styles.btnDisabled : styles.btn}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Product"}
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
    background: "linear-gradient(160deg, #0a0a0f, #0d1117, #0a0f1a)",
    paddingTop: "90px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
  },
  header: { marginBottom: "30px" },
  title: { color: "#fff", fontSize: "28px", fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.5)" },

  form: {
    background: "rgba(212,175,55,0.05)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "20px",
    padding: "30px",
  },

  grid: { display: "grid", gap: "30px" },

  leftCol: { display: "flex", flexDirection: "column", gap: "15px" },

  imageUploadBox: {
    height: "260px",
    border: "2px dashed rgba(212,175,55,0.3)",
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
  },

  previewImg: { width: "100%", height: "100%", objectFit: "cover" },

  uploadPlaceholder: { textAlign: "center", marginTop: "80px" },

  uploadIcon: { fontSize: "40px" },

  uploadText: { color: "#aaa" },

  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },

  checkboxRow: { color: "#fff" },

  rightCol: { display: "flex", flexDirection: "column", gap: "15px" },

  row: { display: "grid", gap: "15px" },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(212,175,55,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },

  textarea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(212,175,55,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(212,175,55,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },

  btnRow: { display: "flex", gap: "10px" },

  cancelBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #999",
    background: "transparent",
    color: "#ccc",
  },

  btn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #d4af37, #f9e077)",
    border: "none",
    color: "#000",
    fontWeight: "700",
  },

  btnDisabled: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    background: "#444",
    color: "#999",
  },
};

export default UpdateProduct;