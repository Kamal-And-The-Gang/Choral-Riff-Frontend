import "../styles/EnsembleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

import drDreKids2 from "../assets/dr_dre_kids_2.png";
import sophie from "../assets/sophie.jpg";
// AJOUT : import des hooks React Router pour récupérer les params et naviguer
import { useNavigate, useParams } from "react-router-dom";

import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";

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

const mockMorceaux = [
  { id: 101, name: "Le Requiem de Riff (2024)", format: "PDF", size: "1.2 MB" },
  {
    id: 102,
    name: "Symphonie Dr Dre (Transcription)",
    format: "MusicXML",
    size: "500 KB",
  },
  { id: 103, name: "Partition test", format: "PDF", size: "800 KB" },
];

type Morceau = {
  id: number;
  name: string;
  format: string;
  size: string;
};

type MorceauItemProps = {
  morceau: Morceau;
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
      title={`Voir les fichiers de ${morceau.name}`}
    >
      <div className="score-item">
        <div className="score-info">
          <FaMusic size={20} className="score-icon" />
          <span className="score-name">{morceau.name}</span>
        </div>
        <div className="score-details">
          <span className="score-format">Voir les fichiers</span>
          <FaChevronRight size={14} className="details-arrow" />
        </div>
      </div>
    </a>
  );
};

export const EnsembleDetails = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>(); // ici on récupère ensembleId
  const ensembleIdNumber = Number(ensembleId); // conversion en number
  const navigate = useNavigate();
  const mockEnsembleExtras: { [id: number]: EnsembleMockExtras } = {
    1: {
      creator: "Michelle Leeb",
      membersCount: 58,
      profilePic: drDreKids2,
      lastMorceau: {
        id: 10,
        title: "What's My Name ?",
        ensemble: "Ensemble : Snoop Dogg",
        year: 2025,
      },
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
    },
    3: {
      creator: "Sophie Marceau",
      membersCount: 15,
      profilePic: sophie,
      lastMorceau: {
        id: 30,
        title: "Certitude",
        ensemble: "Ensemble : Jazz à Paris",
        year: 1985,
      },
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

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

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
   *
   * @param {string} emailInvite
   * @param {number} ensembleId
   * @return {*}
   */

  const creerInvitation = async (emailInvite: string, ensembleId: number) => {
    const body = JSON.stringify({ emailInvite, ensembleId });
    const response = await fetch("http://localhost:8080/api/invitations", {
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
    try {
      const response = await fetch(
        `http://localhost:8080/api/ensembles/${ensembleId}`,
        {
          method: "DELETE",
        }
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

  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">
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
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>
          <div className="add-file-section">
            <a href={`/ensembles/${ensembleId}/ajouter-fichier`}>
              <button className="add-file-button">
                <FaPlus size={14} /> Ajouter un fichier (Partition/Audio)
              </button>
            </a>
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
          </div>
          {/*  VIDÉOS */}
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
                  <p>Veuillez renseigner les informations de la personne que vous souhaitez inviter :</p>
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
    </div>
  );
};
