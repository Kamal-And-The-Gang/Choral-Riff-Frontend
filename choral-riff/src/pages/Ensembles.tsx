// src/pages/Ensembles.tsx

import React from 'react';
// Chemin corrigé vers le dossier styles
import '../styles/Ensembles.css'; 
import { FaBars, FaUsers, FaPlus, FaMusic } from 'react-icons/fa';

// Données d'exemple pour simuler la liste des ensembles
const ensembleData = [
  { id: 1, name: "Chorale du Lac", members: 35, type: "Chorale" },
  { id: 2, name: "Quatuor à Cordes Allegro", members: 4, type: "Quatuor" },
  { id: 3, name: "Orchestre Philharmonique", members: 75, type: "Orchestre" },
  { id: 4, name: "Harmonie Municipale", members: 42, type: "Orchestre d'Harmonie" },
];

export const Ensembles = () => {
  return (
    <div className="ensembles-container">
      {/* 1. Header (Réutilisation du style) */}
      <header className="home-header">
        <div className="logo">
          {/* Assurez-vous d'utiliser la structure du logo final de la page d'accueil si vous n'utilisez pas une image */}
          <FaMusic /> Choral Riff
        </div>
        <div className="menu-icon">
          <FaBars />
        </div>
      </header>

      <main className="ensembles-main">
        <section className="ensembles-header-section">
          <h2>Mes Ensembles Musicaux</h2>
          <button className="new-ensemble-button">
            <FaPlus /> Créer un nouvel ensemble
          </button>
        </section>

        {/* 2. Liste des Ensembles */}
        <section className="ensembles-list">
          {ensembleData.map(ensemble => (
            <div key={ensemble.id} className="ensemble-card">
              <FaUsers size={40} className="ensemble-icon" />
              <div className="ensemble-details">
                <h3>{ensemble.name}</h3>
                <p>Type : {ensemble.type}</p>
                <p>{ensemble.members} membres</p>
              </div>
              <button className="view-ensemble-button">Voir les partitions</button>
            </div>
          ))}
        </section>
      </main>

      {/* 3. Footer (Réutilisation du style) */}
      <footer className="home-footer">
        <a href="#">Liens utiles</a>
        <a href="#">Contacts</a>
        <a href="#">Mentions légales</a>
      </footer>
    </div>
  );
};