// src/components/Header.tsx

import React, { useState } from "react";
import { FaMusic, FaBars } from "react-icons/fa";
import "../styles/HomePage.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="home-header">
      <a href="/" className="logo-link">
        <div className="logo">
          {/* Assurez-vous d'utiliser la structure du logo final avec les spans */}
          <FaMusic /> <span className="logo-orange">C</span>horal
          <span className="logo-orange">R</span>iff
        </div>
      </a>

      <div className="nav-menu">
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        {/* La classe dynamique rend le menu fonctionnel sur mobile */}
        <nav className={`main-nav-links ${isMenuOpen ? "open" : ""}`}>
          <a href="/connexion">Connexion</a>
          <a href="/inscription">Inscription</a>
          <a href="/ensembles">Mon espace</a>
          <a href="/invitation">Invitation</a>
        </nav>
      </div>
    </header>
  );
};
