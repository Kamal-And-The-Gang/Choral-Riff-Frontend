import React from 'react';
import '../styles/Inscription.css';
import { FaBars } from 'react-icons/fa';
import registrationBanner from '../assets/registration-banner.jpg'; // Mettez votre image de bannière ici



export const Inscription = () => {
  return (
    <div className="inscription-container">
      <header className="home-header">
        {/*
          Remplacez le texte par une image de logo si vous en avez une.
          Sinon, gardez la structure de la maquette.
        */}
        <div className="logo">
          Choral Riff
        </div>
        <div className="menu-icon">
          <FaBars />
        </div>
      </header>

      <main>
        <section className="form-section">
          <h2>Inscription</h2>
          <div className="form-card">
            <form>
              <input type="text" placeholder="Nom" className="form-input" />
              <input type="text" placeholder="Prénom" className="form-input" />
              <input type="email" placeholder="Email" className="form-input" />
              <input type="password" placeholder="Mot de passe" className="form-input" />
              <input type="password" placeholder="Confirmation mot de passe" className="form-input" />
              <button type="submit" className="validate-button">Valider</button>
            </form>
          </div>
        </section>

        <section className="banner-section" style={{ backgroundImage: `url(${registrationBanner})` }}>
          <div className="banner-overlay">
            <p>"Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <a href="#">Liens utiles</a>
        <a href="#">Contacts</a>
        <a href="#">Mentions légales</a>
      </footer>
    </div>
  );
};