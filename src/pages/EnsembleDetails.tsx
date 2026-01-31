import "../styles/EnsembleDetails.css";
import { parseISO, format } from "date-fns";
import avatarFlo from "../assets/phot_groupe.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { canDelete, canModify, useAuth } from "../contexts/AuthContext";
import { creerInvitation, type InvitationDTO } from "../api/invitationApi";
import { supprimerEnsemble as apiSupprimerEnsemble } from "../api/ensemble";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaMusic, FaChevronRight, FaPlayCircle, FaPlus } from "react-icons/fa";
import AjouterMorceauForm from "./AjouterMorceauForm";
import {
  getLastMorceauByEnsemble,
  type DernierMorceauAPI,
} from "../api/MorceauxApi";
import DernierMorceauCard from "../components/DernierMorceauCard";

const API_BASE_URL = "http://localhost:8080/api";

// --- DTOs ---

type Morceau = {
  id: number;
  titre: string;
  format: string;
  genre: string;
  descriptif: string;
  compositeur: string;
  size: string;
};

// ➕ Ajout des propriétés manquantes pour éviter erreurs TypeScript
export type Ensemble = {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  createdBy: number;
  createurPrenom?: string;
  createurNom?: string;
  userRole?: string;
  creator?: boolean;
};

const mockVideos = [
  { id: 1, title: "Chorale Snoop et ses amis", date: "06/04/2024", link: "#" },
  {
    id: 2,
    title: "Chorale Les enfants de Dr Dre",
    date: "11/05/2024",
    link: "#",
  },
];

// --- Composant MorceauItem ---
const MorceauItem: React.FC<any> = ({ morceau, ensembleId }): any => {
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



const demanderRattachement = async (
  utilisateurId: number,
  ensembleId: number,
) => {
  try {
    const res = await axios.post(
      `http://localhost:8080/api/invitations/demanderRattachement`,
      null, // POST body vide
      {
        params: { utilisateurId, ensembleId },
      },
    );
    toast.success(res.data.message);
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erreur lors de la demande");
  }
};

// --- Modale confirmation suppression ---
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
      },
    );
  });

export const EnsembleDetails = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const ensembleIdNumber = Number(ensembleId);
  const navigate = useNavigate();

  const [listeMorceaux, setListeMorceaux] = useState<Morceau[]>([]);
  const [loadingListe, setLoadingListe] = useState(true);

  const [dernierMorceau, setDernierMorceau] =
    useState<DernierMorceauAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMorceau, setLoadingMorceau] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const [invitationResponse, setInvitationResponse] =
    useState<InvitationDTO | null>(null);

  // --- API ---

  const fetchAllMorceaux = async () => {
    setLoadingListe(true);
    try {
      const response = await axios.get<Morceau[]>(
        `${API_BASE_URL}/morceaux/ensemble/${ensembleIdNumber}`,
      );
      setListeMorceaux(response.data);
    } catch (error) {
      toast.error("Impossible de charger la liste des morceaux.");
      setListeMorceaux([]);
    } finally {
      setLoadingListe(false);
    }
  };

  const fetchLastMorceau = async () => {
    setLoadingMorceau(true);
    try {
      const morceau = await getLastMorceauByEnsemble(ensembleIdNumber);
      setDernierMorceau(morceau);
    } catch (error) {
      toast.error("Erreur lors du chargement du dernier morceau.");
      setDernierMorceau(null);
    } finally {
      setLoadingMorceau(false);
    }
  };

  useEffect(() => {
    const fetchEnsembleForUser = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        // const response = await fetch(
        //   `http://localhost:8080/api/ensembles/${ensembleId}/forUser/${user.id}`
        // );
        const response = await fetch(
          `${API_BASE_URL}/ensembles/${ensembleIdNumber}?userId=${user?.id}`,
        );

        if (!response.ok)
          throw new Error(`Erreur serveur : ${response.status}`);

        const data: Ensemble = await response.json();

        console.log("ENSEMBLE RECU :", data);

        setEnsemble(data);
      } catch (error: any) {
        setError(error.message);
        toast.error("Impossible de charger l'ensemble.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(ensembleIdNumber)) {
      fetchEnsembleForUser();
      fetchLastMorceau();
      fetchAllMorceaux();
    }
  }, [ensembleIdNumber]);

  const handleMorceauAdded = () => {
    setIsModalOpen(false);
    fetchLastMorceau();
    fetchAllMorceaux();
  };

  if (!ensemble) return <div>Ensemble non trouvé.</div>;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    try {
      const response = await creerInvitation(email, ensembleIdNumber);
      setInvitationResponse(response);

      if (response.existant) {
        if (!response.dejaMembre) {
          toast.info("Cet utilisateur est déjà inscrit.");
        } else {
          toast.warn("Déjà invité.");
        }
      } else {
        toast.success("Invitation envoyée !");
        setShowInvitationModal(false);
      }

      //  correction bloc try/catch
      setEmail("");
      setName("");
    } catch (error: any) {
      toast.error("Erreur : " + (error.message || "Erreur inconnue"));
    }
  };

  const handleSupprimerEnsemble = async () => {
    console.log(
      "Deleting ensembleId:",
      ensembleIdNumber,
      "for userId:",
      user?.id,
    );

    const confirmed = await toastConfirmDelete();
    if (!confirmed) return;

    try {
      await apiSupprimerEnsemble(ensembleIdNumber, user?.id!);
      toast.success("Ensemble supprimé !");
      navigate("/ensembles");
    } catch (error: any) {
      toast.error("Erreur : " + (error.message || "Erreur inconnue"));
    }
  };

  if (loading)
    return <div className="details-container">Chargement de l'ensemble...</div>;

  if (error) return <div className="details-container">Erreur : {error}</div>;

  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">
          {/* ENSEMBLE HEADER */}
          <div className="ensemble-header-card">
            <img
              src={avatarFlo}
              alt={`Image de ${ensemble.nom}`}
              className="ensemble-image"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            {/* INFOS DE L'ENSEMBLE */}

            <div className="ensemble-info">
              <h2 className="ensemble-name">{ensemble.nom}</h2>

              {/* --- Nouvelle ligne pour la date --- */}
              <p>
                Créé le :{" "}
                {ensemble.dateCreation
                  ? format(parseISO(ensemble.dateCreation), "dd/MM/yyyy")
                  : "Date inconnue"}
              </p>

              <div className="ensemble-buttons">
                {ensemble &&
                  (ensemble.userRole === "ADMIN" || ensemble.creator) && (
                    <button
                      type="button"
                      className="submit-button validate-button"
                      onClick={() => navigate(`/ensembles/${ensemble.id}/edit`)}
                    >
                      <FaPlus /> Modifier l'ensemble
                    </button>
                  )}



                {/* Lien "Gérer les invitations" visible uniquement si l'utilisateur est ADMIN */}
                {ensemble.userRole === "ADMIN" && (
                  <Link
                    to={`/ensembles/${ensembleId}/invitations`}
                    className="invitations-button"
                  >
                    Gérer les invitations
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* DERNIER MORCEAU */}
          <DernierMorceauCard
            dernierMorceau={dernierMorceau}
            loadingMorceau={loadingMorceau}
            ensembleIdNumber={ensembleIdNumber}
          />

          {/* MORCEAUX */}
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>

          Vérifie que l'utilisateur est créateur ou admin
          {ensemble.creator || ensemble.userRole === "ADMIN" ? (
            <div className="add-file-section">
              <button
                className="add-file-button"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus size={14} /> Ajouter un Morceau
              </button>
            </div>
          ) : null}



          <h4 className="subsection-title">Liste des morceaux :</h4>
          <div className="scores-list">
            {loadingListe ? (
              <Spinner message="Chargement de la liste des morceaux..." />
            ) : listeMorceaux.length === 0 ? (
              <p>Aucun morceau n'est encore disponible pour cet ensemble.</p>
            ) : (
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
          {((ensemble.userRole && canModify(ensemble.userRole)) ||
            ensemble.creator) && (
              <>
                <button
                  onClick={() => {
                    setShowInvitationModal(true);
                    setInvitationResponse(null);
                  }}
                  type="button"
                >
                  Envoyer invitation
                </button>

                {showInvitationModal && (
                  <div
                    className="modal-overlay"
                    onClick={() => setShowInvitationModal(false)}
                  >
                    <div
                      className="modal-content my-modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="close-modal"
                        onClick={() => setShowInvitationModal(false)}
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



                        {((ensemble.userRole && canModify(ensemble.userRole)) ||
                          ensemble.creator) &&
                          invitationResponse?.existant &&
                          !invitationResponse?.dejaMembre &&
                          invitationResponse.utilisateurId !== undefined && (
                            <button
                              onClick={() => {
                                if (invitationResponse?.utilisateurId == null) {
                                  toast.error(
                                    "Impossible de demander le rattachement : utilisateurId manquant.",
                                  );
                                  return;
                                }

                                // Utiliser la nouvelle méthode
                                demanderRattachement(
                                  invitationResponse.utilisateurId,
                                  ensembleIdNumber,
                                );
                              }}
                            >
                              Demander le rattachement de l'utilisateur à
                              l'ensemble
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
