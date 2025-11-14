import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../contexts/AuthContext";

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
  createdBy: number; // id de l'utilisateur qui a créé l'ensemble
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
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ensembles/${ensembleId}/morceaux/${morceau.id}`, {
      state: { morceauTitre: morceau.titre },
    });
  };

  return (
    <div
      className="score-item"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      title={`Voir les fichiers de ${morceau.titre}`}
    >
      <div className="score-info">
        <FaMusic size={20} className="score-icon" />
        <span className="score-name">
          {morceau.titre} ({morceau.compositeur})
        </span>
      </div>
      <div className="score-details">
        <span className="score-format">Consulter </span>
        <FaChevronRight size={14} className="details-arrow" />
      </div>
    </div>
  );
};

const toastConfirmDelete = () =>
  new Promise<boolean>((resolve) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Êtes-vous sûr de vouloir supprimer cet ensemble ?</p>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <button
              onClick={() => {
                resolve(true);
                closeToast();
              }}
            >
              Oui
            </button>
            <button
              onClick={() => {
                resolve(false);
                closeToast();
              }}
            >
              Non
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  });

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
  // --- Ajout du hook auth ---
  const { user } = useAuth();
  // Fonction pour aller sur TrackDetail
  // const goToTrackDetail = (morceau: Morceau) => {
  //   navigate(`/ensembles/${ensembleId}/morceaux/${morceau.id}`, {
  //     state: {
  //       ensembleNom: ensemble?.nom,
  //       morceauTitre: morceau.titre,
  //     },
  //   });
  // };

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
      toast.error(
        "Impossible de charger la liste des morceaux. Veuillez rééssayer plus tard."
      );
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
  // --- LOG pour vérifier le user ---
  useEffect(() => {
    console.log("User actuel :", user);
  }, [user]);

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

        toast.error(
          "Erreur : impossible de charger les informations de l'ensemble."
        );
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
    toast.error("Veuillez saisir une adresse email valide");
    return;
  }

  try {
    await creerInvitation(email, ensembleIdNumber);
    toast.success("Invitation envoyée !");
    setEmail("");
    setName("");
    setShowModal(false);
  } catch (error: any) {
    // Gestion des doublons selon le backend
    if (error.response?.status === 400) {
      // Ici le backend renvoie 400 si l'email existe déjà
      toast.warn("Une invitation existe déjà pour cet email !");
    } else {
      toast.error("Erreur : " + (error.message || "Erreur inconnue"));
    }
  }
};


  /**
   *
   * @param {string} emailInvite
   * @param {number} ensembleId
   * @return {*}
   */
//  const creerInvitation = async (emailInvite: string, ensembleId: number) => {
//   const body = JSON.stringify({ emailInvite, ensembleId });
//   const response = await fetch(`${API_BASE_URL}/invitations`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body,
//   });

//   if (response.status === 409) {
//     // Utilisateur déjà invité
//     const error = new Error("Utilisateur déjà invité ou rattaché à cet ensemble");
//     (error as any).response = response; 
//     throw error;
//   }

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Erreur serveur : ${response.status} - ${errorText}`);
//   }

//   return await response.json();
// };

const creerInvitation = async (emailInvite: string, ensembleId: number) => {
  const body = JSON.stringify({ emailInvite, ensembleId });
  const response = await fetch(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Création d'une erreur avec status pour le front
    const err: any = new Error(errorText || "Erreur serveur");
    err.response = { status: response.status };
    throw err;
  }

  return await response.json();
};


  const supprimerEnsemble = async () => {
    const confirmed = await toastConfirmDelete();
    if (!confirmed) return;

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
              <p>
                Créé par : {user?.prenom} {user?.nom}
              </p>

              <div className="ensemble-buttons">
                {/* {(user?.id && Number(user.id) === ensemble.createdBy) && ( */}

                {/* {user?.id != null && +user.id === ensemble.createdBy}

                <>
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/addensemble?id=${ensembleId}`)}
                  >
                    Modifier
                  </button>

                  <button className="delete-button" onClick={supprimerEnsemble}>
                    Supprimer
                  </button>
                </> */}
                {user?.id != null && +user.id === ensemble.createdBy && (
  <>
    <button
      className="edit-button"
      onClick={() => navigate(`/addensemble?id=${ensembleId}`)}
    >
      Modifier
    </button>

    <button className="delete-button" onClick={supprimerEnsemble}>
      Supprimer
    </button>
  </>
)}

              </div>
            </div>
          </div>

          {/* DERNIER MORCEAU DYNAMIQUE */}
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
              <Spinner message="Chargement de la liste des morceaux..." />
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

          <button onClick={() => setShowModal(true)} type="button">
            Envoyer invitation
          </button>
          <div className="form-card">
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
