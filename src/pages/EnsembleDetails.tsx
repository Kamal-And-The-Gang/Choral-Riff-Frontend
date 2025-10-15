import React, { useState } from "react";
import "../styles/EnsembleDetails.css";
import {
  FaMusic,
  FaShareAlt,
  FaChevronRight,
  FaPlayCircle,
  FaFilePdf,
  FaDownload,
  FaPlus,
} from "react-icons/fa";

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

// Ces éléments sont maintenant considérés comme des Morceaux (Morceaux)
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

/**
 * Type pour un Morceau (Morceau), qui mène à la page MorceauDetails.
 */
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

// Composant renommé et transformé en lien
const MorceauItem: React.FC<MorceauItemProps> = ({ morceau, ensembleId }) => {
  // Le lien pointe vers /ensembles/:ensembleId/morceaux/:morceauId
  const morceauLink = `/ensembles/${ensembleId}/morceaux/${morceau.id}`;

  return (
    // Utilisation d'un lien (<a>) autour de l'élément visuel
    <a
      href={morceauLink}
      className="morceau-item-link"
      title={`Voir les fichiers de ${morceau.name}`}
    >
      <div className="score-item">
        <div className="score-info">
          {/* Utiliser FaMusic pour représenter un Morceau (Conteneur de fichiers) */}
          <FaMusic size={20} className="score-icon" />
          <span className="score-name">{morceau.name}</span>
        </div>
        <div className="score-details">
          <span className="score-format">Voir les fichiers</span>
          <FaChevronRight size={14} className="details-arrow" />{" "}
          {/* Flèche de navigation */}
        </div>
      </div>
    </a>
  );
};

export const EnsembleDetails = () => {
  // Données fictives pour la fiche - AJOUT DES ID
  const ensemble = {
    id: 1, // ID de l'ensemble ajouté
    name: "Les enfants de Dr Dre",
    creator: "Michelle Leeb",
    createdDate: "18/08/2025",
    membersCount: 58,
    profilePic: "../assets/ensemble-pic.jpg",
    lastMorceau: {
      id: 10, // ID du morceau ajouté
      title: "What's My Name ?",
      ensemble: "Ensemble : Snoop Dogg",
      year: 2025,
    },
  };
  // Ici j'ajoute le state pour l'email
  const [email, setEmail] = useState("");

  const ensembleId = ensemble.id;
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // pour éviter le rechargement de la page

    if (!email.trim()) {
      alert("Veuillez saisir une adresse email.");
      return; // stop la soumission si email vide ou que des espaces
    }

    try {
      const data = await creerInvitation(email, ensembleId);
      console.log("Invitation réussie, réponse API :", data);
      console.log("Envoi invitation avec :", { email, ensembleId });

      alert("Invitation envoyée !");
      setEmail(""); // reset l'input
    } catch (error) {
      console.error("Erreur dans handleInviteSubmit :", error);
      alert("Erreur lors de l'envoi de l'invitation");
    }
  };

  const creerInvitation = async (emailInvite: string, ensembleId: number) => {
    console.log(">>> Appel API /api/invitations <<<");
    console.log("Données envoyées :", {
      emailInvite,
      ensembleId,
      typeEnsembleId: typeof ensembleId,
    });

    const body = JSON.stringify({ emailInvite, ensembleId });
    console.log("Payload JSON.stringify :", body);

    const response = await fetch("http://localhost:8080/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    console.log("Réponse brute :", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur réponse serveur :", errorText);
      throw new Error(`Erreur serveur : ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Données reçues du backend :", data);
    return data;
  };

  return (
    <div className="details-container">
      {/* Bannière "Fiche Ensemble" */}
      <main className="details-main">
        <div className="details-content-card fiche-card">
          {/* Infos de l'ensemble (Haut de la carte) */}
          {/* Lien vers la liste des membres */}
          <a
            href={`/ensembles/${ensembleId}/membres`}
            className="members-link"
            title="Voir la liste des membres et gérer l'équipe"
          >
            Liste des membres ({ensemble.membersCount}){" "}
            <FaChevronRight size={12} />
          </a>
          {/* Dernier Morceau */}
          <h3 className="section-title">Dernière Morceau :</h3>
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
          {/* FIN DU LIEN */}
          {/* Fichiers et Audios */}
          <h3 className="section-title">
            Morceaux (Partitions & Audios) :
          </h3>{" "}
          {/* Titre mis à jour */}
          {/* Ajouter un fichier */}
          <div className="add-file-section">
            {/* Ce lien mène à la page d'ajout de fichier pour cet ensemble */}
            <a href={`/ensembles/${ensembleId}/ajouter-fichier`}>
              <button className="add-file-button">
                <FaPlus size={14} /> Ajouter un fichier (Partition/Audio)
              </button>
            </a>
          </div>
          {/* LISTE DES MORCEAUX (Utilisation du composant MorceauItem) */}
          <h4 className="subsection-title">Liste des morceaux :</h4>{" "}
          {/* Titre mis à jour */}
          <div className="scores-list">
            {mockMorceaux.map((morceau) => (
              <MorceauItem
                key={morceau.id}
                morceau={morceau}
                ensembleId={ensembleId}
              />
            ))}
          </div>
          {/* Vidéos de lives */}
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
          {/* Boutons d'action */}
          <div className="form-card">
            <form onSubmit={handleInviteSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Bouton "Inviter" dans le formulaire */}
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
