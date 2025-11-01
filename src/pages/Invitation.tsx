import "../styles/HomePage.css";
import React from "react";

export const Invitation: React.FC = () => {
  return (
    <div>
      <h1>Gestion d'ensemble</h1>

      <div className="container">
        <h2>Membres</h2>
        <input type="text" id="search" placeholder="Recherche" />
        <button>Filtrer</button>
        <button>Ajouter</button>
        <div className="form-card">
          <form>
            <input type="text" placeholder="Nom" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="text" placeholder="Statut" className="form-input" />
            <input type="text" placeholder="Rôle" className="form-input" />

            <button type="submit" className="validate-button">
              Envoyer message
            </button>
          </form>
        </div>
        <br /> <br />
        <div className="form-card">
          <form>
            <input type="text" placeholder="Nom" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="text" placeholder="Statut" className="form-input" />
            <input type="text" placeholder="Rôle" className="form-input" />
            <button type="submit" className="validate-button">
              Envoyer message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
