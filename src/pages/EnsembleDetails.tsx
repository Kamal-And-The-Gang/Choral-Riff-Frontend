import "../styles/EnsembleDetails.css";
import drDreKids2 from "../assets/dr_dre_kids_2.png";
// AJOUT : import des hooks React Router pour récupérer les params et naviguer
import { useNavigate, useParams } from "react-router-dom";

import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";
import { useState } from "react";

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

  const mockEnsembles = [
    {
      id: 1,
      name: "Les enfants de Dr Dre",
      creator: "Michelle Leeb",
      createdDate: "18/08/2025",
      membersCount: 58,
      profilePic: drDreKids2,
      lastMorceau: {
        id: 10,
        title: "What's My Name ?",
        ensemble: "Ensemble : Snoop Dogg",
        year: 2025,
      },
    },
    {
      id: 2,
      name: "Red Hot Chili Peppers",
      creator: "Anthony Kiedis",
      createdDate: "01/02/2023",
      membersCount: 4,
      profilePic:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80", // guitare rock
      lastMorceau: {
        id: 20,
        title: "Californication",
        ensemble: "Ensemble : RHCP",
        year: 2023,
      },
    },

    {
      id: 3,
      name: "Jazz à Paris",
      creator: "Sophie Marceau",
      createdDate: "12/07/2024",
      membersCount: 15,
      profilePic:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // saxophone
      lastMorceau: {
        id: 30,
        title: "Autumn Leaves",
        ensemble: "Ensemble : Jazz à Paris",
        year: 2024,
      },
    },
    {
      id: 4,
      name: "Orchestre Symphonique Lyon",
      creator: "Jean Dupont",
      createdDate: "25/11/2022",
      membersCount: 120,
      profilePic:
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=400&q=80", // violon orchestre
      lastMorceau: {
        id: 40,
        title: "Symphonie n°5",
        ensemble: "Ensemble : OS Lyon",
        year: 2022,
      },
    },
    {
      id: 5,
      name: "Rock Rebels",
      creator: "Léa Martin",
      createdDate: "05/03/2025",
      membersCount: 8,
      profilePic:
        "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=400&q=80", // rock concert
      lastMorceau: {
        id: 50,
        title: "Rebel Yell",
        ensemble: "Ensemble : Rock Rebels",
        year: 2025,
      },
    },
  ];

  const [email, setEmail] = useState("");

  // Trouve l'ensemble correspondant à l'id
  const ensemble = mockEnsembles.find((e) => e.id === ensembleIdNumber);
  // Si ensemble non trouvé (id incorrect)
  if (!ensemble) {
    return <div>Ensemble non trouvé.</div>;
  }

  // const ensembleId = ensemble.id;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Veuillez saisir une adresse email.");
      return;
    }

    try {
      await creerInvitation(email, ensembleIdNumber);
      console.log("Envoi invitation avec :", { email, ensembleId });

      alert("Invitation envoyée !");
      setEmail("");
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  };

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

      alert("Ensemble supprimé avec succès !");
      navigate("/ensembles"); // redirection après suppression
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Erreur lors de la suppression de l'ensemble : " + error.message);
      } else {
        alert("Erreur inconnue lors de la suppression de l'ensemble");
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
              alt={`Photo de ${ensemble.name}`}
              className="ensemble-photo"
            />

            <div className="ensemble-info">
              <h2 className="ensemble-name">{ensemble.name}</h2>
              <p>Créé par : {ensemble.creator}</p>
              <p>Créé le : {ensemble.createdDate}</p>
              <p>Nombre de membres : {ensemble.membersCount}</p>

              <div className="ensemble-buttons">
                <a
                  href={`/ensembles/${ensembleId}/modifier`}
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
          <h3 className="section-title">Morceaux (Partitions & Audios) :</h3>
          <div className="add-file-section">
            <a href={`/ensembles/${ensembleId}/ajouter-fichier`}>
              <button className="add-file-button">
                <FaPlus size={14} /> Ajouter un fichier (Partition/Audio)
              </button>
            </a>
          </div>

          <h4 className="subsection-title">Liste des morceaux :</h4>
          <div className="scores-list">
            {mockMorceaux.map((morceau) => (
              <MorceauItem
                key={morceau.id}
                morceau={morceau}
                ensembleId={ensembleId}
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
    </div>
  );
};
