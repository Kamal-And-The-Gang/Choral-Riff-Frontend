// src/pages/EnsembleDetails.tsx

import React from 'react'; // Ajout de l'import React pour la cohérence
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/EnsembleDetails.css';
import { FaMusic, FaShareAlt, FaChevronRight, FaPlayCircle, FaFilePdf, FaDownload, FaPlus } from 'react-icons/fa';

// Fichiers de données fictives
const mockVideos = [
    { id: 1, title: "Chorale Snoop et ses amis", date: "06/04/2024", link: "#" },
    { id: 2, title: "Chorale Les enfants de Dr Dre", date: "11/05/2024", link: "#" },
];

const mockScores = [
    { id: 101, name: "Le Requiem de Riff (2024)", format: "PDF", size: "1.2 MB" },
    { id: 102, name: "Symphonie Dr Dre (Transcription)", format: "MusicXML", size: "500 KB" },
    { id: 103, name: "Partition test", format: "PDF", size: "800 KB" },
];

/**
 * Composant pour l'affichage d'une partition, incluant l'interaction.
 */
type Score = {
    id: number;
    name: string;
    format: string;
    size: string;
};

type ScoreItemProps = {
    score: Score;
};

const ScoreItem: React.FC<ScoreItemProps> = ({ score }) => {
    // Simuler le clic pour télécharger ou visualiser
    const handleScoreClick = () => {
        alert(`Vous avez cliqué sur "${score.name}". Déclenchement du téléchargement...`);
    };

    return (
        <div className="score-item">
            <div className="score-info">
                <FaFilePdf size={20} className="score-icon" />
                <span className="score-name">{score.name}</span>
            </div>
            <div className="score-details">
                <span className="score-format">({score.format})</span>
                <span className="score-size">{score.size}</span>
                <button
                    onClick={handleScoreClick}
                    className="download-button"
                    title="Télécharger la partition"
                >
                    <FaDownload size={14} />
                </button>
            </div>
        </div>
    );
};


export const EnsembleDetails = () => {
    // Données fictives pour la fiche
    const ensemble = {
        name: "Les enfants de Dr Dre",
        creator: "Michelle Leeb",
        createdDate: "18/08/2025",
        membersCount: 58,
        profilePic: '../assets/ensemble-pic.jpg', // À remplacer
        lastTrack: {
            title: "What's My Name ?",
            ensemble: "Ensemble : Snoop Dogg",
            year: 2025
        }
    };

    return (
        <div className="details-container">
            <Header />

            {/* Bannière "Fiche ensemble" avec une image de fond différente */}
            <section className="ensemble-header-section detail-header">
                <div className="fiche-title-box">
                    <h1 className="fiche-title">Fiche ensemble</h1>
                </div>
            </section>

            <main className="details-main">
                <div className="details-content-card fiche-card">

                    {/* Infos de l'ensemble (Haut de la carte) */}
                    <div className="ensemble-info-header">
                        <img
                            src={ensemble.profilePic}
                            alt="Photo de l'ensemble"
                            className="ensemble-profile-pic"
                        />
                        <div className="ensemble-info-details">
                            <h2>{ensemble.name}</h2>
                            <p>Créé par : {ensemble.creator}</p>
                            <p>Créé le : {ensemble.createdDate}</p>
                            <p>Nbr de membres : {ensemble.membersCount}</p>
                        </div>
                    </div>

                    {/* Lien vers la liste des membres */}
                    <a href="#" className="members-link">
                        Liste des membres <FaChevronRight size={12} />
                    </a>

                    {/* Dernière Track */}
                    <h3 className="section-title">Dernière Track :</h3>
                    <div className="last-track-box">
                        <FaMusic size={40} className="track-icon" />
                        <div className="track-info">
                            <p className="track-title-name">{ensemble.lastTrack.title}</p>
                            <p className="track-subtitle">{ensemble.lastTrack.ensemble}</p>
                            <p className="track-subtitle">{ensemble.lastTrack.year}</p>
                        </div>
                    </div>

                    {/* Fichiers et Audios */}
                    <h3 className="section-title">Fichiers et audios :</h3>
                    {/* Ajouter un fichier */}
                    <div className="add-file-section">
                        <a href="/ensembles/1/ajouter-fichier">
                            <button className="add-file-button">
                                <FaPlus size={14} /> Ajouter un fichier (Partition/Audio)
                            </button>
                        </a>
                    </div>

                    {/* PARTITIONS (Utilisation du composant ScoreItem) */}
                    <h4 className="subsection-title">Partitions :</h4>
                    <div className="scores-list">
                        {mockScores.map(score => (
                            <ScoreItem key={score.id} score={score} />
                        ))}
                    </div>

                    {/* Vidéos de lives */}
                    <h4 className="subsection-title">Vidéos de lives :</h4>
                    <div className="video-grid">
                        {mockVideos.map(video => (
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
                    <div className="action-buttons">
                        <button className="share-button"><FaShareAlt size={18} /></button>
                        <button className="invite-button">Inviter</button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};