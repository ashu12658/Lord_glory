import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import "../pages/sideMenu.css"; // ✅ Fixed Import Path

const SideMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Toggle Button */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Side Menu */}
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>

        <h2>Welcome, {user?.name || "User"}!</h2>

        <ul>
          <li onClick={() => navigate("/orders")}>📦 My Orders</li>
          <li className="logout" onClick={logout}>🚪 Logout</li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
