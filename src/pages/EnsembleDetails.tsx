import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import drDreKids2 from "../assets/dr_dre_kids_2.png";
import sophie from "../assets/sophie.jpg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";

// 🚨 SIMULATION : Import des composants d'API et Modale
import AjouterMorceauForm from './AjouterMorceauForm';
import { useEffect, useState } from "react";

// TODO: Kamal s'occupe de la gestion des morceaux (affichage, ajout, suppression)
// À compléter dans la section des morceaux plus bas dans le composant

// URL de base de votre API
const API_BASE_URL = "http://localhost:8080/api";

// 🚨 Type du morceau récupéré pour l'affichage de la liste
type MorceauListeDTO = {
  morceauId: number; // J'utilise morceauId pour correspondre au DTO du backend
  titre: string;
  compositeur: string;
  genre: string;
  // La liste n'a pas besoin de format/size, mais on peut les simuler si le backend les donne
};

// 🚨 Type du morceau récupéré pour le "Dernier Morceau" (inchangé)
type DernierMorceauAPI = {
  morceauId: number;
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
};

// --- Composant MorceauItem (mis à jour pour utiliser MorceauListeDTO) ---

type MorceauItemProps = {
  morceau: MorceauListeDTO; // Utilise le type DTO
  ensembleId: number;
};

//21/10 DTO
type Ensemble = {
  id: number;
  nom: string;
  description: string;
  dateCreation: string; // ← LocalDate devient string côté front
};
// Type pour le mock (avec infos en plus que le backend ne renvoie pas)
type LastMorceauMock = {
  id: number;
  title: string;
  ensemble: string;
  year: number;
};
type EnsembleMockExtras = {
  creator: string;
  membersCount: number;
  profilePic: string;
  lastMorceau: LastMorceauMock;
};

const MorceauItem: React.FC<MorceauItemProps> = ({ morceau, ensembleId }) => {
  // Utilisez morceauId pour la navigation
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
          {/* Utilise titre au lieu de name */}
          <span className="score-name">{morceau.titre} ({morceau.compositeur})</span>
        </div>
        <div className="score-details">
          {/* Affiche le genre ou une autre info pertinente */}
          <span className="score-format">Genre: {morceau.genre}</span>
          <FaChevronRight size={14} className="details-arrow" />
        </div>
      </div>
    </a>
  );
};

// --- Début du Composant EnsembleDetails ---

export const EnsembleDetails = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const ensembleIdNumber = Number(ensembleId);
  const navigate = useNavigate();
  const mockEnsembleExtras: { [id: number]: EnsembleMockExtras } = {
    1: {

  // 🚨 AJOUT DE L'ÉTAT POUR LA LISTE COMPLÈTE
  const [listeMorceaux, setListeMorceaux] = useState<MorceauListeDTO[]>([]);
  const [loadingListe, setLoadingListe] = useState(true);

  const [dernierMorceau, setDernierMorceau] = useState<DernierMorceauAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMorceau, setLoadingMorceau] = useState(true);

  // Données mockées d'ensembles (inchangé)
  const mockEnsembles = [
    // ... (vos données mockées d'ensembles)
    {
      id: 1,
      name: "Les enfants de Dr Dre",
      creator: "Michelle Leeb",
      membersCount: 58,
      profilePic: drDreKids2,
    },
    2: {
      creator: "Anthony Kiedis",
      membersCount: 4,
      profilePic:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
      lastMorceau: {
        id: 20,
        title: "Californication",
        ensemble: "Ensemble : RHCP",
        year: 2006,
      },
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    },
    3: {
    {
      id: 3,
      name: "Jazz à Paris",
      creator: "Sophie Marceau",
      membersCount: 15,
      profilePic: sophie,
      lastMorceau: {
        id: 30,
        title: "Certitude",
        ensemble: "Ensemble : Jazz à Paris",
        year: 1985,
      },
      profilePic:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    4: {
      creator: "Jean Dupont",
      membersCount: 120,
      profilePic:
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=400&q=80",
      lastMorceau: {
        id: 40,
        title: "Symphonie n°5",
        ensemble: "Ensemble : OS Lyon",
        year: 2022,
      },
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=400&q=80",
    },
    5: {
      creator: "Kamal",
      membersCount: 8,
      profilePic: drDreKids2,
      lastMorceau: {
        id: 50,
        title: "The Chronic",
        ensemble: "Ensemble : Gangsta rap",
        year: 2025,
      },
    },
  };

  type EnsembleComplet = Ensemble & EnsembleMockExtras;
      profilePic:
        "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=400&q=80",
    },
  ];
  
  // Mock de vidéos utilisé plus bas (id, title, date)
  const mockVideos = [
    { id: 1, title: "Concert Live - 2025", date: "12/06/2025" },
    { id: 2, title: "Répétition générale", date: "05/04/2025" },
    { id: 3, title: "Masterclass: Direction", date: "20/02/2025" },
  ];

  const [email, setEmail] = useState("");
  const [ensemble, setEnsemble] = useState<EnsembleComplet | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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

        const data = await response.json();

        const extras = mockEnsembleExtras[data.id] || {
          creator: "Inconnu",
          membersCount: 0,
          profilePic: sophie,
          lastMorceau: { id: 0, title: "", ensemble: "", year: 0 },
        };
        // Combine données API + extras
        setEnsemble({ ...data, ...extras });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(ensembleIdNumber)) {
      fetchEnsemble();
    } else {
      setError("Identifiant d'ensemble invalide");
      setLoading(false);
    }
  }, [ensembleIdNumber]);

  // Trouve l'ensemble correspondant à l'id
  // const ensemble = mockEnsembles.find((e) => e.id === ensembleIdNumber);
  // Si ensemble non trouvé (id incorrect)
  const ensemble = mockEnsembles.find((e) => e.id === ensembleIdNumber);

  if (!ensemble) {
    return <div>Ensemble non trouvé.</div>;
  }

  // const ensembleId = ensemble.id;

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
      console.log("Envoi invitation avec :", { email, ensembleId });

      toast.success("Invitation envoyée !");
      setEmail("");
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  /**
   *
   *
   * @param {string} emailInvite
   * @param {number} ensembleId
   * @return {*}
   */


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
      setListeMorceaux([]); 
      setLoadingListe(false);
    }
  };


  const fetchLastMorceau = async () => {
    setLoadingMorceau(true);
    try {
      // Utilisez l'ID de l'ensemble dans l'appel du dernier morceau
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

  useEffect(() => {
    fetchLastMorceau(); 
    fetchAllMorceaux(); 
  }, [ensembleId]);

  // 🚨 FONCTION D'ACTUALISATION : recharge le dernier morceau ET la liste
  const handleMorceauAdded = () => {
    setIsModalOpen(false);
    fetchLastMorceau();
    fetchAllMorceaux();
  };

  // --- Fonctions creerInvitation et supprimerEnsemble ---
  const creerInvitation = async (emailInvite: string, ensembleId: number) => {
    // ... (votre code d'appel API)
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
      alert("Veuillez saisir une adresse email.");
      return;
    }
    try {
      await creerInvitation(email, ensembleIdNumber);
      alert("Invitation envoyée !");
      setEmail("");
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  };

  const supprimerEnsemble = async () => {
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
      alert("Ensemble supprimé avec succès !");
      navigate("/ensembles");
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

  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">

          {/* ... (Header et Dernier Morceau) ... */}
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
          {/*  DERNIER MORCEAU */}
          <h3 className="section-title">Dernier Morceau :</h3>
          <a
            href={`/ensembles/${ensembleId}/morceaux/${ensemble.lastMorceau.id}`}
            className="last-morceau-link"
            title={`Voir les détails du morceau: ${ensemble.lastMorceau.title}`}
          >
            <div className="last-morceau-box">
              <FaMusic size={40} className="morceau-icon" />
              <div className="morceau-info">
                <p className="morceau-title-name">
                  {ensemble.lastMorceau.title}
                </p>
                <p className="morceau-subtitle">
                  {ensemble.lastMorceau.ensemble}
                </p>
                <p className="morceau-subtitle">{ensemble.lastMorceau.year}</p>
              </div>
            </div>
          </a>
          {/*  FICHIERS */}

          {/* AFFICHAGE DU DERNIER MORCEAU DYNAMIQUE */}
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

          {/*  FICHIERS */}
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>
          <div className="add-file-section">
            <button className="add-file-button" onClick={() => setIsModalOpen(true)}>
              <FaPlus size={14} /> Ajouter un Morceau
            </button>
          </div>
      
          <h4 className="subsection-title">Liste des morceaux :</h4>
              {/* TODO: Afficher la liste réelle des morceaux depuis l'API */}
          <div className="scores-list">
            {mockMorceaux.map((morceau) => (
              <MorceauItem
                key={morceau.id}
                morceau={morceau}
                ensembleId={ensembleIdNumber}
              />
            ))}
            {/* Affichage de la liste */}
            {loadingListe ? (
              <p>Chargement de la liste des morceaux...</p>
            ) : listeMorceaux.length === 0 ? (
              <p>Aucun morceau n'est encore disponible pour cet ensemble.</p>
            ) : (
              listeMorceaux.map((morceau) => (
                <MorceauItem
                  key={morceau.morceauId}
                  morceau={morceau} // Utilise MorceauListeDTO
                  ensembleId={ensembleIdNumber}
                />
              ))
            )}
          </div>
          {/*  VIDÉOS */}

          {/*  VIDÉOS  */}
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

          {/* INVITATION  */}
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

            <div className="action-buttons"></div>
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