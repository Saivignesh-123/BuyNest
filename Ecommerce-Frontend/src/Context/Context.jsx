import axios from "axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

  const refreshData = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const login = async (username, password) => {
    const response = await axios.post(`${API}/login`, { username, password });
    const { token: newToken, username: uname, role } = response.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify({ username: uname, role }));
    setToken(newToken);
    setUser({ username: uname, role });
    await fetchCart(uname, newToken);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API}/register`, { username, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const fetchCart = async (username, tkn) => {
    try {
      const t = tkn || localStorage.getItem("token");
      const response = await axios.get(`${API}/cart/${username}`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  const addToCart = async (product) => {
    if (!user) return alert("Please login first!");
    try {
      const t = localStorage.getItem("token");
      await axios.post(`${API}/cart`, {
        username: user.username,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${t}` }
      });
      await fetchCart(user.username);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const t = localStorage.getItem("token");
      await axios.delete(`${API}/cart/${user.username}/${productId}`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      await fetchCart(user.username);
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const t = localStorage.getItem("token");
      await axios.delete(`${API}/cart/clear/${user.username}`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  useEffect(() => {
    refreshData();
    if (user && token) fetchCart(user.username, token);
  }, []);

  return (
    <AppContext.Provider value={{
      data, isError, cart, user, token,
      addToCart, removeFromCart, clearCart,
      refreshData, login, register, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;