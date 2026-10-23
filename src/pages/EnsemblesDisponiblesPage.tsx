
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/EnsemblesDisponiblesPage.css";
import { FaUsers } from "react-icons/fa";
interface Ensemble {
  id: number;
  nom: string;
  description: string | null;
  typeEnsemble: string | null;
  nombreMembres: number;
}

export const EnsemblesDisponiblesPage = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

 useEffect(() => {
  fetch("http://localhost:8080/api/ensembles")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data: Ensemble[]) => {
      setEnsembles(data);
    })
    .catch((error) => {
      console.error("Erreur de chargement :", error);
      setErreur("Impossible de récupérer les ensembles.");
    })
    .finally(() => setChargement(false));
}, []);

  if (chargement) {
    return <p>Chargement des ensembles...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }

  

return (
  <div className="ensembles-disponibles">
    <header className="decouverte-header">
      <h1>Découvrir les ensembles musicaux</h1>
      <p>{ensembles.length} ensemble(s) trouvé(s)</p>
    </header>

    {ensembles.length === 0 ? (
      <p>Aucun ensemble disponible.</p>
    ) : (
      <div className="ensembles-grid">
        {ensembles.map((ensemble) => (
          <article key={ensemble.id} className="ensemble-card">
            <div className="ensemble-icon">
              <FaUsers />
            </div>

            <div className="ensemble-details">
              <h2>{ensemble.nom}</h2>
              <p>
                Type : {ensemble.typeEnsemble ?? "Non précisé"}
              </p>
              <p>
                {ensemble.description || "Aucune description disponible."}
              </p>
              <p>Nombre de membres : {ensemble.nombreMembres}</p>
            </div>

            <Link to="/inscription">Rejoindre</Link>
          </article>
        ))}
      </div>
    )}
  </div>
);


};
