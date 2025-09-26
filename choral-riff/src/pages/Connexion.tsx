import React from 'react';
import '../styles/Connexion.css'; // Nouveau fichier CSS
import { FaBars } from 'react-icons/fa';
import registrationBanner from '../assets/registration-banner.jpg'; // Réutilisation de la bannière

// Assurez-vous d'avoir une image de logo si vous en avez une.

export const Connexion = () => {
  return (
    <div className="connexion-container">
      {/* 1. Header (Identique à la page Inscription/Home) */}
      <header className="home-header">
        <div className="logo">
          Choral Riff
        </div>
        <div className="menu-icon">
          <FaBars />
        </div>
      </header>

      <main>
        {/* Section du formulaire */}
        <section className="form-section">
          <h2>Connexion</h2>
          <div className="form-card">
            <form>
              <input type="email" placeholder="Email" className="form-input" />
              <input type="password" placeholder="Mot de passe" className="form-input" />
              <button type="submit" className="validate-button">Se connecter</button>
            </form>
          </div>
        </section>

        {/* Section de la bannière (Identique à la page Inscription) */}
        <section className="banner-section" style={{ backgroundImage: `url(${registrationBanner})` }}>
          <div className="banner-overlay">
            <p>"Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"</p>
          </div>
        </section>
      </main>

      {/* Footer (Identique) */}
      <footer className="home-footer">
        <a href="#">Liens utiles</a>
        <a href="#">Contacts</a>
        <a href="#">Mentions légales</a>
      </footer>
    </div>
  );
};