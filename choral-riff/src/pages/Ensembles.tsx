import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/Ensembles.css';
import { FaUsers, FaPlus } from 'react-icons/fa';

// Typage des données pour la robustesse
interface Ensemble {
  id: number;
  name: string;
  members: number;
  type: string;
}

// Typage des props du composant
interface EnsembleListItemProps {
  ensemble: Ensemble;
}

// Données d'exemple pour simuler la liste des ensembles
const ensembleData: Ensemble[] = [
  { id: 1, name: "Les enfants de Dr Dre", members: 11, type: "Chorale" },
  { id: 2, name: "Red Hot Chili Peppers", members: 4, type: "Quatuor" },
  { id: 3, name: "Orchestre Lyrique", members: 75, type: "Orchestre" },
  { id: 4, name: "Harmonie Municipale", members: 42, type: "Orchestre d'Harmonie" },
];

/**
 * Composant réutilisable pour afficher un élément de la liste des ensembles.
 */
const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => (
  <a href={`/ensembles/${ensemble.id}`} className="ensemble-list-item-link">
    <div className="ensemble-card">
      <FaUsers size={40} className="ensemble-icon" />
      <div className="ensemble-details">
        <h3>{ensemble.name}</h3>
        <p>Type : {ensemble.type}</p>
        <p>{ensemble.members} membres</p>
      </div>
      <button className="view-ensemble-button">Voir les partitions</button>
    </div>
  </a>
);


export const Ensembles = () => {
  return (
    <div className="ensembles-container">
      {/* 1. Header  */}
      <Header />

      <main className="ensembles-main">
        <section className="ensembles-header-section">
          <h2>Mes Ensembles Musicaux</h2>
          <a href="/ajouter-ensemble">
            <button className="new-ensemble-button">
              <FaPlus /> Créer un nouvel ensemble
            </button>
          </a>
        </section>

        {/* 2. Liste des Ensembles */}
        <section className="ensembles-list">
          {ensembleData.map(ensemble => (
            // Utilisation du composant dédié pour chaque élément
            <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
          ))}
        </section>
      </main>

      {/* 3. Footer*/}
      <Footer />
    </div>
  );
};