
import React, { useState } from "react";
import "../styles/EnsembleDetails.css";
import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaPlus,
} from "react-icons/fa";

// Fichiers de données fictives
const mockVideos = [
  { id: 1, title: "Chorale Snoop et ses amis", date: "06/04/2024", link: "#" },
  { id: 2, title: "Chorale Les enfants de Dr Dre", date: "11/05/2024", link: "#" },
];

const mockMorceaux = [
  { id: 101, name: "Le Requiem de Riff (2024)", format: "PDF", size: "1.2 MB" },
  { id: 102, name: "Symphonie Dr Dre (Transcription)", format: "MusicXML", size: "500 KB" },
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
    <a href={morceauLink} className="morceau-item-link" title={`Voir les fichiers de ${morceau.name}`}>
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
  const ensemble = {
    id: 1,
    name: "Les enfants de Dr Dre",
    creator: "Michelle Leeb",
    createdDate: "18/08/2025",
    membersCount: 58,
    profilePic: "../assets/ensemble-pic.jpg",
    lastMorceau: {
      id: 10,
      title: "What's My Name ?",
      ensemble: "Ensemble : Snoop Dogg",
      year: 2025,
    },
  };

  const [email, setEmail] = useState("");

  const ensembleId = ensemble.id;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Veuillez saisir une adresse email.");
      return;
    }

    try {
  await creerInvitation(email, ensembleId);
  console.log("Envoi invitation avec :", { email, ensembleId });

  alert("Invitation envoyée !");
  setEmail("");
} catch (error) {
      alert("Erreur lors de l'envoi de l'invitation");
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

  const supprimerEnsemble = () => {
    alert("Suppression de l'ensemble");
  };

  return (
    <div className="details-container">
      <main className="details-main">
        <div className="details-content-card fiche-card">

          {/*  HEADER ENSEMBLE */}
          <div className="ensemble-header-card">
            <button className="delete-button" onClick={supprimerEnsemble}>✖</button>
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
              <a
                href={`/ensembles/${ensembleId}/modifier`}
                className="edit-link"
                title="Modifier cet ensemble"
              >
                <button className="edit-button">Modifier</button>
              </a>
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
                <p className="morceau-title-name">{ensemble.lastMorceau.title}</p>
                <p className="morceau-subtitle">{ensemble.lastMorceau.ensemble}</p>
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
              <MorceauItem key={morceau.id} morceau={morceau} ensembleId={ensembleId} />
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
              <button type="submit" className="invite-button">Inviter</button>
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
