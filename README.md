# 🛒 BuyNest — Full Stack E-Commerce Platform

> A modern full-stack e-commerce platform where users can browse, shop, and manage orders — powered by React, Spring Boot, and Docker.

---

## 🌐 Live Demo

|                | Link                                      |
| -------------- | ----------------------------------------- |
| 🖥️ Frontend   | https://buynest-vignesh.netlify.app       |
| ⚙️ Backend API | https://buynest-backend-12nk.onrender.com |

> ⚠️ Backend is hosted on Render free tier — may take 30–60 seconds to wake up on first request.

---

## 👑 Roles in the System

### 🙋 Customer

Users can:

* ✅ Register & Login securely (JWT-based)
* ✅ Browse products across categories
* ✅ Search and filter products
* ✅ Add items to cart
* ✅ Place orders
* ✅ View order history
* ✅ Cancel pending orders

---

### 👑 Admin

Admin has full control over the platform:

* 👑 Add new products (with image upload)
* 👑 Update product details
* 👑 Delete products
* 👑 View all customer orders
* 👑 Update order status (Pending → Delivered)
* 👑 Manage entire store operations

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication
* Role-based access (USER / ADMIN)
* Secure password encryption (BCrypt)

---

### 🛍️ Product Management

* Add, update, delete products
* Product images stored in database
* Category-based filtering
* Search functionality

---

### 🛒 Cart System

* Persistent cart (stored in DB)
* Add/remove/update quantity
* Auto total calculation

---

### 📦 Order System

* Place orders from cart
* Track order status
* Cancel pending orders
* Admin order management

---

### 🎨 UI/UX

* Dark premium theme (Gold + Black)
* Fully responsive design
* Smooth user experience

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* CSS3
* Axios

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* PostgreSQL (Neon)

### DevOps

* Docker (multi-stage build)
* Render (backend deployment)
* Netlify (frontend deployment)

---

## 🏗️ Architecture

User → Netlify (Frontend) → Render (Backend) → Neon DB

---

## 📁 Project Structure

SpringBoot-Reactjs-Ecommerce/
├── Ecommerce-Backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── security/
│   └── Dockerfile
│
└── Ecommerce-Frontend/
├── components/
├── pages/
└── App.jsx

---

## 🚀 Run Locally

### Backend

cd Ecommerce-Backend
mvn spring-boot:run

---

### Frontend

cd Ecommerce-Frontend
npm install
npm run dev

---

## 🔐 Environment Variables

### Backend

DATABASE_URL=your_db_url
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

---

### Frontend

VITE_API_URL=http://localhost:8080

---

## 👨‍💻 Author

**Sai vignesh**

GitHub: https://github.com/Saivignesh-123

---

## 📄 License

MIT License

---

<p align="center">Built with ❤️ by Sai Vignesh</p>
