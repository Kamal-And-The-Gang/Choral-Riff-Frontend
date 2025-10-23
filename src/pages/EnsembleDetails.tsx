import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

import drDreKids2 from "../assets/dr_dre_kids_2.png";
import sophie from "../assets/sophie.jpg";
// Correction: Supprimer l'import redondant de useState et useEffect ici
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { FaMusic, FaChevronRight, FaPlayCircle, FaPlus } from "react-icons/fa";

// Import du composant Modale
import AjouterMorceauForm from "./AjouterMorceauForm";

// URL de base de votre API
const API_BASE_URL = "http://localhost:8080/api";

// --- DTOs ---

// Type du morceau récupéré pour le "Dernier Morceau"
type DernierMorceauAPI = {
  id: number;
  titre: string;
  compositeur: string;
  genre: string;
};

// TODO: K s'occupe de la gestion des morceaux (affichage, ajout, suppression)
// À compléter dans la section des morceaux plus bas dans le composant

// Fichiers de données fictives

const mockVideos = [
  { id: 1, title: "Chorale Snoop et ses amis", date: "06/04/2024", link: "#" },
  {
    id: 2,
    title: "Chorale Les enfants de Dr Dre",
    date: "11/05/2024",
    link: "#",
  },
];

// Type du morceau récupéré pour l'affichage de la liste
type Morceau = {
  id: number;
  titre: string;
  format: string;
  genre: string;
  descriptif: string;
  compositeur: string;
  size: string;
};

type MorceauItemProps = {
  morceau: Morceau;
  ensembleId: number;
};

// DTO pour les données d'ensemble de l'API
type Ensemble = {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
};

// --- Composant MorceauItem ---

// type MorceauItemProps = {
//   morceau: MorceauListeDTO;
//   ensembleId: number;
// };

/**
 *
 *
 * @param {*} { morceau, ensembleId }
 * @return {*}
 */
const MorceauItem: React.FC<MorceauItemProps> = ({ morceau, ensembleId }) => {
  const morceauLink = `/ensembles/${ensembleId}/morceaux/${morceau.id}`;

  return (
    <a
      href={morceauLink}
      className="morceau-item-link"
      title={`Voir les fichiers de ${morceau.titre}`}
    >
      <div className="score-item">
        <div className="score-info">
          <FaMusic size={20} className="score-icon" />
          <span className="score-name">
            {morceau.titre} ({morceau.compositeur})
          </span>
        </div>
        <div className="score-details">
          <span className="score-format">Genre: {morceau.genre}</span>
          <FaChevronRight size={14} className="details-arrow" />
        </div>
      </div>
    </a>
  );
};

export const EnsembleDetails = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const ensembleIdNumber = Number(ensembleId);
  const navigate = useNavigate();

  // --- États ---
  const [listeMorceaux, setListeMorceaux] = useState<Morceau[]>([]);
  const [loadingListe, setLoadingListe] = useState(true);

  const [dernierMorceau, setDernierMorceau] =
    useState<DernierMorceauAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMorceau, setLoadingMorceau] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Correction: La variable 'mockMorceaux' était définie globalement mais non utilisée, on la supprime.

  // --- Fonctions d'appel API ---

  // CHARGER TOUS LES MORCEAUX
  const fetchAllMorceaux = async () => {
    setLoadingListe(true);
    try {
      const response = await axios.get<Morceau[]>(
        `${API_BASE_URL}/morceaux/ensemble/${ensembleIdNumber}`
      );
      setListeMorceaux(response.data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement de la liste des morceaux:",
        error
      );
      // Correction: Afficher une erreur utilisateur si la liste ne charge pas
      toast.error("Impossible de charger la liste des morceaux.");
      setListeMorceaux([]);
    } finally {
      setLoadingListe(false);
    }
  };

  // CHARGER LE DERNIER MORCEAU
  const fetchLastMorceau = async () => {
    setLoadingMorceau(true);
    try {
      const response = await axios.get<DernierMorceauAPI>(
        `${API_BASE_URL}/ensembles/${ensembleIdNumber}/morceaux/last`
      );
      setDernierMorceau(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setDernierMorceau(null);
      } else {
        console.error("Erreur lors du chargement du dernier morceau:", error);
      }
    } finally {
      setLoadingMorceau(false);
    }
  };

  // CHARGER L'ENSEMBLE
  useEffect(() => {
    const fetchEnsemble = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8080/api/ensembles/${ensembleIdNumber}`
        );
        if (!response.ok) {
          throw new Error(`Erreur serveur : ${response.status}`);
        }

        const data: Ensemble = await response.json();

        // Combine données API + extras
        setEnsemble(data);
      } catch (error: any) {
        setError(error.message);
        toast.error(`Erreur : ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(ensembleIdNumber)) {
      fetchEnsemble();
      fetchLastMorceau();
      fetchAllMorceaux();
    } else {
      setError("Identifiant d'ensemble invalide");
      setLoading(false);
    }
  }, [ensembleIdNumber]); // Dépendance à l'ID de l'ensemble

  // FONCTION D'ACTUALISATION : recharge le dernier morceau ET la liste après ajout
  const handleMorceauAdded = () => {
    setIsModalOpen(false);
    fetchLastMorceau();
    fetchAllMorceaux();
  };

  // --- Fonctions d'Action (Invitation/Suppression) ---

  if (!ensemble) {
    return <div>Ensemble non trouvé.</div>;
  }

  /**
   *
   *
   * @param {React.FormEvent} e
   * @return {*}
   */
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email.");

      return;
    }
    try {
      await creerInvitation(email, ensembleIdNumber);
      console.log("Invitation envoyée avec :", { name, email, ensembleId });

      toast.success("Invitation envoyée !");
      setEmail("");
      setName("");
      setShowModal(false); // Ferme la modale
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  /**
   *
   * @param {string} emailInvite
   * @param {number} ensembleId
   * @return {*}
   */
  const creerInvitation = async (emailInvite: string, ensembleId: number) => {
    const body = JSON.stringify({ emailInvite, ensembleId });
    const response = await fetch(`${API_BASE_URL}/invitations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur serveur : ${response.status} - ${errorText}`);
    }
    return await response.json();
  };

  const supprimerEnsemble = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet ensemble ? Cette action est irréversible."
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/ensembles/${ensembleIdNumber}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression : ${response.statusText}`
        );
      }

      toast.success("Ensemble supprimé avec succès !");
      navigate("/ensembles"); // redirection après suppression
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          "Erreur lors de la suppression de l'ensemble : " + error.message
        );
      } else {
        toast.error("Erreur inconnue lors de la suppression de l'ensemble");
      }
    }
  };

  // --- Gestion du chargement et des erreurs ---

  if (loading) {
    return <div className="details-container">Chargement de l'ensemble...</div>;
  }

  if (error || !ensemble) {
    return (
      <div className="details-container">
        Erreur : {error || "Ensemble non trouvé."}
      </div>
    );
  }

  // --- Rendu ---
  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">
          {/* ENSEMBLE HEADER */}
          <div className="ensemble-header-card">
            {/* <img
              src={ensemble.profilePic}
              alt={`Photo de ${ensemble.nom}`}
              className="ensemble-photo"
            /> */}

            <div className="ensemble-info">
              <h2 className="ensemble-name">{ensemble.nom}</h2>
              {/* <p>Créé par : {ensemble.creator}</p> */}
              <p>Créé le : {ensemble.dateCreation}</p>
              {/* <p>Nombre de membres : {ensemble.membersCount}</p> */}

              <div className="ensemble-buttons">
                <button
                  className="edit-button"
                  onClick={() => navigate(`/addensemble?id=${ensembleId}`)}
                >
                  Modifier
                </button>

                <button className="delete-button" onClick={supprimerEnsemble}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {/* DERNIER MORCEAU DYNAMIQUE */}
          <h3 className="section-title">Dernier Morceau Ajouté :</h3>
          {loadingMorceau ? (
            <p>Chargement du dernier morceau...</p>
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
                    Compositeur: {dernierMorceau.compositeur}
                  </p>
                  <p className="morceau-subtitle">
                    Genre: {dernierMorceau.genre}
                  </p>
                </div>
              </div>
            </a>
          ) : (
            <p>Aucun morceau n'a encore été ajouté.</p>
          )}

          {/* FICHIERS / LISTE DES MORCEAUX */}
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>
          <div className="add-file-section">
            <button
              className="add-file-button"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus size={14} /> Ajouter un Morceau
            </button>
          </div>

          <h4 className="subsection-title">Liste des morceaux :</h4>
          <div className="scores-list">
            {loadingListe ? (
              <p>Chargement de la liste des morceaux...</p>
            ) : listeMorceaux.length === 0 ? (
              <p>Aucun morceau n'est encore disponible pour cet ensemble.</p>
            ) : (
              // Utilisation de la liste des morceaux dynamique
              listeMorceaux.map((morceau) => (
                <MorceauItem
                  key={morceau.id}
                  morceau={morceau}
                  ensembleId={ensembleIdNumber}
                />
              ))
            )}
          </div>

          {/* VIDÉOS */}
          <h4 className="subsection-title">Vidéos de lives :</h4>
          <div className="video-grid">
            {mockVideos.map((video) => (
              <div key={video.id} className="video-vignette">
                <FaPlayCircle size={24} className="play-icon" />
                <div className="video-text">
                  <p>{video.title}</p>
                  <p>{video.date}</p>
                  <p className="youtube-tag">YouTube</p>
                </div>
              </div>
            ))}
          </div>

          {/* INVITATION */}
          <div className="form-card">
            <button onClick={() => setShowModal(true)} type="button">
              Envoyer invitation
            </button>

            {/* MODALE */}
            {showModal && (
              <div
                className="modal-overlay"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="modal-content my-modal"
                  onClick={(e) => e.stopPropagation()} // empêche la fermeture si clic dans la modale
                >
                  <span
                    className="close-modal"
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </span>
                  <h2>Invitation</h2>
                  <p>
                    Veuillez renseigner les informations de la personne que vous
                    souhaitez inviter :
                  </p>
                  <form onSubmit={handleInviteSubmit}>
                    <div className="form-group">
                      <label>Nom :</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email :</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <button type="submit">Envoyer</button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* <div className="action-buttons"></div>
          </div> */}
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MODALE D'AJOUT DE MORCEAU */}
      {isModalOpen && (
        <AjouterMorceauForm
          onClose={() => setIsModalOpen(false)}
          onMorceauAdded={handleMorceauAdded}
          ensembleId={ensembleIdNumber}
        />
      )}
    </div>
  );
};
