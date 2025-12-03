import React from "react";
import { FaMusic } from "react-icons/fa";
import Spinner from "../pages/Spinner";

// Définitions de types à réutiliser ou importer
type DernierMorceauAPI = {
  id: number;
  titre: string;
  compositeur: string;
  genre: string;
  // Ajoutez tous les autres champs si nécessaire
};

type DernierMorceauCardProps = {
  dernierMorceau: DernierMorceauAPI | null;
  loadingMorceau: boolean;
  ensembleIdNumber: number;
};

const DernierMorceauCard: React.FC<DernierMorceauCardProps> = ({
  dernierMorceau,
  loadingMorceau,
  ensembleIdNumber,
}) => {
  return (
    <>
      <h3 className="section-title">Dernier Morceau Ajouté :</h3>
      {loadingMorceau ? (
        <Spinner message="Chargement du dernier morceau..." />
      ) : dernierMorceau ? (
        <a
          href={`/ensembles/${ensembleIdNumber}/morceaux/${dernierMorceau.id}`}
          className="last-morceau-link"
          title={`Voir les détails du morceau: ${dernierMorceau.titre}`}
        >
          <div className="last-morceau-box">
            <FaMusic size={40} className="morceau-icon" />
            <div className="morceau-info">
              <p className="morceau-title-name">{dernierMorceau.titre}</p>
              <p className="morceau-subtitle">
                <span style={{ fontWeight: 'bold' }}>Compositeur :</span> {dernierMorceau.compositeur}
              </p>
              <p className="morceau-subtitle">
                <span style={{ fontWeight: 'bold' }}>Genre :</span> {dernierMorceau.genre}
              </p>
            </div>
          </div>
        </a>
      ) : (
        <p>Aucun morceau n'a encore été ajouté.</p>
      )}
    </>
  );
};

export default DernierMorceauCard;