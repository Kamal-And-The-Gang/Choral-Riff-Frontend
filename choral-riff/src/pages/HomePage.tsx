import React from 'react';
import './HomePage.css'; // Nous allons créer ce fichier CSS juste après
import { FaUsers, FaFileAlt, FaPlayCircle, FaHandshake, FaBars, FaMusic } from 'react-icons/fa';

// Importe les images depuis le dossier assets
import heroImage from '../assets/hero-background.jpg'// Mettez votre image de fond ici
import avatarLucas from '../assets/avatar-lucas.jpg'; // Mettez l'avatar de Lucas ici
import avatarFlo from '../assets/avatar-flo.jpg'; // Mettez l'avatar de Flo ici


export const HomePage = () => {
  return (
    <div className="home-container">
      {/* 1. Header */}
      <header className="home-header">
        <div className="logo">
          <FaMusic /> Choral Riff
        </div>
        <div className="menu-icon">
          <FaBars />
        </div>
      </header>

      <main>
        {/* 2. Section "Hero" */}
        <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-overlay">
            <h1>"Simplifiez le partage, l'écoute et l'organisation"</h1>
          </div>
        </section>

        {/* 3. Section "Features" */}
        <section className="features-section">
          <h2>Choral Riff, votre allié pour la musique !</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FaUsers size={30} />
              <span>Multi-profils</span>
            </div>
            <div className="feature-item">
              <FaFileAlt size={30} />
              <span>Tous formats</span>
            </div>
            <div className="feature-item">
              <FaPlayCircle size={30} />
              <span>Écoute directe</span>
            </div>
            <div className="feature-item">
              <FaHandshake size={30} />
              <span>Collaboration fluide</span>
            </div>
          </div>
        </section>

        {/* 4. Section "Testimonials" */}
        <section className="testimonials-section">
          <h3>"Ce que nos utilisateurs en disent"</h3>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <img src={avatarLucas} alt="Lucas, chef de coeur" />
              <p>"Lucas, chef de coeur : Choral Riff a transformé notre gestion des partitions. Simple et collaboratif !"</p>
            </div>
            <div className="testimonial-card">
              <img src={avatarFlo} alt="Flo, professeur de musique" />
              <p>"Flo, professeur de musique : Compatible avec tous mes fichiers, parfait pour mes cours !"</p>
            </div>
          </div>
        </section>

        {/* 5. Section "Call to Action" */}
        <section className="cta-section">
          <h4>Entre dans la vibe !</h4>
          <button className="cta-button">
            S'inscrire 
            {/* L'icône de l'onde sonore est complexe, on la simule ici */}
            <span className="sound-wave">|||</span>
          </button>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="home-footer">
        <a href="#">Liens utiles</a>
        <a href="#">Contacts</a>
        <a href="#">Mentions légales</a>
      </footer>
    </div>
  );
};