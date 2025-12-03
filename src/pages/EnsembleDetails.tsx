import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../contexts/AuthContext";
import { creerInvitation, type InvitationDTO } from "../api/invitationApi";
import { supprimerEnsemble as apiSupprimerEnsemble } from "../api/ensemble";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMusic, FaChevronRight, FaPlayCircle, FaPlus } from "react-icons/fa";
// Import du composant Modale
import AjouterMorceauForm from "./AjouterMorceauForm";
import { getLastMorceauByEnsemble } from "../api/MorceauxApi";
import DernierMorceauCard from "../components/DernierMorceauCard";



// URL de base de votre API
const API_BASE_URL = "http://localhost:8080/api";

// --- DTOs ---

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
  const [invitationResponse, setInvitationResponse] =
    useState<InvitationDTO | null>(null);

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
      // *** Utilisation de la fonction centralisée de MorceauxApi.ts ***
      const morceau = await getLastMorceauByEnsemble(ensembleIdNumber);
      setDernierMorceau(morceau);
    } catch (error) {
      // La fonction getLastMorceauByEnsemble gère le 404 (retourne null), 
      // donc on gère ici les autres erreurs (réseau/serveur 500)
      console.error("Erreur critique lors du chargement du dernier morceau:", error);
      toast.error("Erreur lors du chargement du dernier morceau de l'ensemble.");
      setDernierMorceau(null);
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


  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    try {
      // Appel API pour vérifier l'utilisateur / invitation
      const response = await creerInvitation(email, ensembleIdNumber);

      setInvitationResponse(response);

      if (response.existant && !response.dejaMembre) {
        // Utilisateur existant mais pas encore invité → juste afficher le bouton "Rattacher"
        toast.info(
          "Cet utilisateur est déjà inscrit. Vous pouvez le rattacher à l'ensemble."
        );
      } else if (response.dejaMembre) {
        toast.warn(
          "Une invitation a déjà été envoyée à cet email pour cet ensemble."
        );
      } else {
        // Utilisateur nouveau → invitation envoyée
        toast.success("Invitation envoyée !");
      }

      setEmail("");
      setName("");
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.warn(error.response.data?.error || "Une erreur est survenue");
      } else if (error.response?.status === 404) {
        toast.error(error.response.data?.error || "Ressource introuvable");
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

  const handleSupprimerEnsemble = async () => {
    const confirmed = await toastConfirmDelete();
    if (!confirmed) return;

    try {
      await apiSupprimerEnsemble(ensembleIdNumber); // <-- ici l'appel correct à l'API
      toast.success("Ensemble supprimé avec succès !");
      navigate("/ensembles");
    } catch (error: any) {
      toast.error(
        "Erreur lors de la suppression de l'ensemble : " +
        (error.message || "Erreur inconnue")
      );
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

  // Nouvelle fonction
  async function rattacherUtilisateur(
    utilisateurId: number | undefined,
    ensembleId: number
  ) {
    if (!utilisateurId) {
      toast.error("Impossible de rattacher : utilisateur inconnu.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/invitations/rattacher`,
        null,
        { params: { utilisateurId, ensembleId } }
      );

      toast.success(
        response.data?.message || "Utilisateur rattaché avec succès !"
      );

      // Fermer la modale
      setShowModal(false);
    } catch (error: any) {
      console.error("Erreur lors du rattachement :", error);
      toast.error(
        error.response?.data?.error || "Impossible de rattacher l'utilisateur"
      );
    }
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
                {user?.id != null && +user.id === ensemble.createdBy && (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/addensemble?id=${ensembleId}`)}
                    >
                      Modifier
                    </button>

                    <button
                      className="delete-button"
                      onClick={handleSupprimerEnsemble} // <-- utiliser le nouveau handler
                    >
                      Supprimer
                    </button>

                    {/* Nouveau lien pour les invitations */}
                    <Link
                      to={`/ensembles/${ensembleId}/invitations`}
                      className="invitations-button"
                    >
                      Gérer les invitations
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* DERNIER MORCEAU DYNAMIQUE */}
          <DernierMorceauCard
            dernierMorceau={dernierMorceau}
            loadingMorceau={loadingMorceau}
            ensembleIdNumber={ensembleIdNumber}
          />

          {/* FICHIERS / LISTE DES MORCEAUX */}
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>

          {/* Ajouter un Morceau - visible uniquement pour le créateur ou les admins */}
          {user &&
            (user.globalRole === "ADMIN" ||
              +user.id === ensemble.createdBy) && (
              <div className="add-file-section">
                <button
                  className="add-file-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaPlus size={14} /> Ajouter un Morceau
                </button>
              </div>
            )}

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
          {/* INVITATION - visible uniquement pour le créateur ou les admins */}
          {user &&
            (user.globalRole === "ADMIN" ||
              +user.id === ensemble.createdBy) && (
              <>
                {/* <button onClick={() => setShowModal(true)} type="button">
                  Envoyer invitation
                </button> */}
                <button
                  onClick={() => {
                    setShowModal(true);
                    setInvitationResponse(null); // <-- réinitialisation
                  }}
                  type="button"
                >
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
                        Veuillez renseigner les informations de la personne que
                        vous souhaitez inviter :
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

                        {/* {(invitationResponse?.existant ||
                          invitationResponse?.utilisateurId) && (
                          <button
                            type="button"
                            onClick={() =>
                              rattacherUtilisateur(
                                invitationResponse.utilisateurId,
                                ensembleIdNumber
                              )
                            }
                          >
                            Rattacher cet utilisateur à l'ensemble
                          </button>
                        )} */}

                        {/* Bouton visible seulement pour les admins */}
                        {+user.id === ensemble.createdBy &&
                          invitationResponse?.existant &&
                          !invitationResponse?.dejaMembre && (
                            <button
                              type="button"
                              onClick={() =>
                                rattacherUtilisateur(
                                  invitationResponse.utilisateurId,
                                  ensembleIdNumber
                                )
                              }
                            >
                              Rattacher cet utilisateur à l'ensemble
                            </button>
                          )}
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
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
