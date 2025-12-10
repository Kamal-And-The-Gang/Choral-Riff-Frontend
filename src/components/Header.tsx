// Header.tsx (Modifié)

import { useState } from "react";
import { FaMusic, FaBars, FaBell } from "react-icons/fa"; // 💡 Importez FaBell
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext"; // 💡 Import du Hook
import { logoutUser } from "../api/authApi";
import NotificationPopUp from "../components/NotificationPopUp"; // 💡 Import du PopUp
import "../styles/HomePage.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // 💡 Utilisation du Hook de Notification
  const { unreadCount, loading } = useNotifications(); 
  const [showPopUp, setShowPopUp] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout(); // Nettoie le contexte et le localStorage
      toast.success("Déconnexion réussie 👋");
      navigate("/"); // ✅ Redirige vers la page d’accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsMenuOpen(false);
    }
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
        
        {/* 💡 Zone de Notification */}
        {isAuthenticated && (
          <div className="notification-area">
            <button 
                className="notification-icon-button"
                onClick={() => setShowPopUp(!showPopUp)}
                disabled={loading}
            >
              <FaBell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            {showPopUp && (
                <NotificationPopUp onClose={() => setShowPopUp(false)} />
            )}
          </div>
        )}
        
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
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};