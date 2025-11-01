import { useState } from "react";
import { FaMusic, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../api/authApi";
import "../styles/HomePage.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
              {/* <a href="/invitation">Invitation</a> */}
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
