import React, { useState } from "react";
import { FaMusic, FaBars } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "../styles/HomePage.css";
import { logoutUser } from "../api/authApi";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Erreur lors de la déconnexion :", e);
    }
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="home-header">
      <a href="/" className="logo-link">
        <div className="logo">
          <FaMusic /> <span className="logo-orange">C</span>horal
          <span className="logo-orange">R</span>iff
        </div>
      </a>

      <div className="nav-menu">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        <nav className={`main-nav-links ${isMenuOpen ? "open" : ""}`}>
          {!isAuthenticated ? (
            <>
              <a href="/connexion">Connexion</a>
              <a href="/inscription">Inscription</a>
            </>
          ) : (
            <>
              <a href="/ensembles">Mon espace</a>
              <a href="/invitation">Invitation</a>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
