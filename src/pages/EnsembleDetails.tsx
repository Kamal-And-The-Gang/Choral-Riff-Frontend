import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import drDreKids2 from "../assets/dr_dre_kids_2.png";
import sophie from "../assets/sophie.jpg";
// Correction: Supprimer l'import redondant de useState et useEffect ici
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react"; // 🚨 Correctement importé ici

import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";

// Import du composant Modale
import AjouterMorceauForm from './AjouterMorceauForm';

// URL de base de votre API
const API_BASE_URL = "http://localhost:8080/api";

// --- DTOs ---

// Type du morceau récupéré pour l'affichage de la liste
type MorceauListeDTO = {
  morceauId: number;
  titre: string;
  compositeur: string;
  genre: string;
};

// Type du morceau récupéré pour le "Dernier Morceau"
type DernierMorceauAPI = {
  morceauId: number;
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
};

// DTO pour les données d'ensemble de l'API
type EnsembleAPI = {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
};

// Types pour le mock (Données supplémentaires non fournies par l'API principale)
type EnsembleMockExtras = {
  creator: string;
  membersCount: number;
  profilePic: string;
};
// Type final combiné
type EnsembleComplet = EnsembleAPI & EnsembleMockExtras;

// --- Composant MorceauItem ---

type MorceauItemProps = {
  morceau: MorceauListeDTO;
  ensembleId: number;
};

const MorceauItem: React.FC<MorceauItemProps> = ({ morceau, ensembleId }) => {
  const morceauLink = `/ensembles/${ensembleId}/morceaux/${morceau.morceauId}`;

  return (
    <a
      href={morceauLink}
      className="morceau-item-link"
      title={`Voir les fichiers de ${morceau.titre}`}
    >
      <div className="score-item">
        <div className="score-info">
          <FaMusic size={20} className="score-icon" />
          <span className="score-name">{morceau.titre} ({morceau.compositeur})</span>
        </div>
        <div className="score-details">
          <span className="score-format">Genre: {morceau.genre}</span>
          <FaChevronRight size={14} className="details-arrow" />
        </div>
      </div>
    </a>
  );
};

// --- Début du Composant EnsembleDetails ---

// Correction: Structure et contenu des mocks simplifiés pour éviter les erreurs de syntaxe
const mockEnsembleExtras: { [id: number]: EnsembleMockExtras } = {
  1: {
    creator: "Michelle Leeb",
    membersCount: 58,
    profilePic: drDreKids2,
  },
  2: {
    creator: "Anthony Kiedis",
    membersCount: 4,
    profilePic: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  3: {
    creator: "Sophie Marceau",
    membersCount: 15,
    profilePic: sophie, // Utilisation de l'import 'sophie'
  },
  4: {
    creator: "Jean Dupont",
    membersCount: 120,
    profilePic: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=400&q=80",
  },
  5: {
    creator: "Kamal",
    membersCount: 8,
    profilePic: "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=400&q=80",
  },
};

// Mock de vidéos utilisé (id, title, date)
const mockVideos = [
  { id: 1, title: "Concert Live - 2025", date: "12/06/2025" },
  { id: 2, title: "Répétition générale", date: "05/04/2025" },
  { id: 3, title: "Masterclass: Direction", date: "20/02/2025" },
];


export const EnsembleDetails = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const ensembleIdNumber = Number(ensembleId);
  const navigate = useNavigate();

  // --- États ---
  const [listeMorceaux, setListeMorceaux] = useState<MorceauListeDTO[]>([]);
  const [loadingListe, setLoadingListe] = useState(true);

  const [dernierMorceau, setDernierMorceau] = useState<DernierMorceauAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMorceau, setLoadingMorceau] = useState(true);

  const [email, setEmail] = useState("");
  const [ensemble, setEnsemble] = useState<EnsembleComplet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Correction: La variable 'mockMorceaux' était définie globalement mais non utilisée, on la supprime.


  // --- Fonctions d'appel API ---

  // CHARGER TOUS LES MORCEAUX
  const fetchAllMorceaux = async () => {
    setLoadingListe(true);
    try {
      const response = await axios.get<MorceauListeDTO[]>(
        `${API_BASE_URL}/ensembles/${ensembleIdNumber}/morceaux`
      );
      setListeMorceaux(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de la liste des morceaux:", error);
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

        const data: EnsembleAPI = await response.json();

        // Ajout des données mockées (extras)
        const extras = mockEnsembleExtras[data.id] || {
          creator: "Inconnu",
          membersCount: 0,
          profilePic: sophie,
        };
        // Combine données API + extras
        setEnsemble({ ...data, ...extras });

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
  
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez saisir une adresse email.");
      return;
    }

    try {
      await creerInvitation(email, ensembleIdNumber);
      toast.success("Invitation envoyée !");
      setEmail("");
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  const supprimerEnsemble = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet ensemble ? Cette action est irréversible.")) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/ensembles/${ensembleIdNumber}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression : ${response.statusText}`);
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
    return <div className="details-container">Erreur : {error || "Ensemble non trouvé."}</div>;
  }

  // --- Rendu ---
  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">

          {/* ENSEMBLE HEADER */}
          <div className="ensemble-header-card">
            <img
              src={ensemble.profilePic}
              alt={`Photo de ${ensemble.nom}`}
              className="ensemble-photo"
            />

            <div className="ensemble-info">
              <h2 className="ensemble-name">{ensemble.nom}</h2>
              <p>Créé par : {ensemble.creator}</p>
              <p>Créé le : {ensemble.dateCreation}</p>
              <p>Nombre de membres : {ensemble.membersCount}</p>

              <div className="ensemble-buttons">
                <a
                  href={`/ensembles/${ensembleIdNumber}/modifier`}
                  className="edit-link"
                  title="Modifier cet ensemble"
                >
                  <button className="edit-button">Modifier</button>
                </a>

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
              href={`/ensembles/${ensembleIdNumber}/morceaux/${dernierMorceau.morceauId}`}
              className="last-morceau-link"
              title={`Voir les détails du morceau: ${dernierMorceau.titre}`}
            >
              <div className="last-morceau-box">
                <FaMusic size={40} className="morceau-icon" />
                <div className="morceau-info">
                  <p className="morceau-title-name">
                    {dernierMorceau.titre}
                  </p>
                  <p className="morceau-subtitle">
                    Compositeur: {dernierMorceau.compositeur}
                  </p>
                  <p className="morceau-subtitle">Genre: {dernierMorceau.genre}</p>
                </div>
              </div>
            </a>
          ) : (
            <p>Aucun morceau n'a encore été ajouté.</p>
          )}

          {/* FICHIERS / LISTE DES MORCEAUX */}
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>
          <div className="add-file-section">
            <button className="add-file-button" onClick={() => setIsModalOpen(true)}>
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
                  key={morceau.morceauId}
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
            <form onSubmit={handleInviteSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="invite-button">
                Inviter
              </button>
            </form>

            <div className="action-buttons">
                 <button className="share-button">
                   <FaShareAlt size={18} />
                 </button>
            </div>
          </div>
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