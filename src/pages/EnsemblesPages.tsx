import React, { useEffect, useState } from "react";

import "../styles/MonEspace.css";
import { FaUsers, FaPlus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import ensembleBanner from "../assets/banniere-mon-espace.jpg";
import userProfilePic from "../assets/avatar-michelle.jpg";
import toast from "react-hot-toast";

interface Ensemble {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  members: number;
  type: string;
}

interface EnsembleListItemProps {
  ensemble: Ensemble;
}

const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => (
  <Link to={`/ensembles/${ensemble.id}`} className="ensemble-list-item-link">
    <div className="ensemble-card">
      <FaUsers size={40} className="ensemble-icon" />
      <div className="ensemble-details">
        <h3>{ensemble.nom}</h3>
        <p>Description : {ensemble.description}</p>
        <p>Créé le : {new Date(ensemble.dateCreation).toLocaleDateString()}</p>
        <p>Type : {ensemble.type}</p>
        <p>{ensemble.members} membres :</p>
      </div>
      <button className="view-ensemble-button">Voir les partitions</button>
    </div>
  </Link>
);


export const EnsemblesPage = () => {
  const location = useLocation(); // <-- ici, au début de la fonction

  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (location.state?.successMessage) {
    toast.success(location.state.successMessage);
  }

  fetch("http://localhost:8080/api/ensembles")
    .then((res) => res.json())
    .then((data) => {
      setEnsembles(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des ensembles :", error);
      setLoading(false);
    });
}, [location.state?.refresh, location.state?.successMessage]);


  if (loading) return <p>Chargement...</p>;

  return (
    <div className="ensembles-container">
      <section
        className="ensembles-banner"
        style={{ backgroundImage: `url(${ensembleBanner})` }}
      >
        <div className="banner-overlay">
          <h2>Mon espace</h2>
        </div>
      </section>

      <main className="ensembles-main">
        <div className="profile-section">
          <img src={userProfilePic} alt="Photo de profil" className="profile-pic" />
          <div className="profile-info">
            <p className="profile-name">Michelle Leeb</p>
          </div>
        </div>

        <section className="ensembles-list-section">
          <div className="ensembles-header-section">
            <h2>Mes Ensembles Musicaux</h2>
          </div>

          <div className="ensembles-list">
            {ensembles.map((ensemble) => (
              <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
            ))}
          </div>

          <div className="add-ensemble-footer-button">
            <a href="/ajouter-ensemble">
              <button className="submit-button">
                <FaPlus /> Créer un nouvel ensemble
              </button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
