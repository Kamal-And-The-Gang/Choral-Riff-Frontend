import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/EnsembleDetails.css';
import { FaMusic, FaShareAlt, FaChevronRight, FaPlayCircle, FaFilePdf, FaDownload, FaPlus } from 'react-icons/fa';

// Fichiers de données fictives
const mockVideos = [
    { id: 1, title: "Chorale Snoop et ses amis", date: "06/04/2024", link: "#" },
    { id: 2, title: "Chorale Les enfants de Dr Dre", date: "11/05/2024", link: "#" },
];

// Ces éléments sont maintenant considérés comme des Morceaux (Tracks)
const mockTracks = [
    { id: 101, name: "Le Requiem de Riff (2024)", format: "PDF", size: "1.2 MB" },
    { id: 102, name: "Symphonie Dr Dre (Transcription)", format: "MusicXML", size: "500 KB" },
    { id: 103, name: "Partition test", format: "PDF", size: "800 KB" },
];

/**
 * Type pour un Morceau (Track), qui mène à la page TrackDetails.
 */
type Track = {
    id: number;
    name: string;
    format: string;
    size: string;
};

type TrackItemProps = {
    track: Track;
    ensembleId: number;
};

// Composant renommé et transformé en lien
const TrackItem: React.FC<TrackItemProps> = ({ track, ensembleId }) => {
    // Le lien pointe vers /ensembles/:ensembleId/morceaux/:trackId
    const trackLink = `/ensembles/${ensembleId}/morceaux/${track.id}`;

    return (
        // Utilisation d'un lien (<a>) autour de l'élément visuel
        <a href={trackLink} className="track-item-link" title={`Voir les fichiers de ${track.name}`}>
            <div className="score-item">
                <div className="score-info">
                    {/* Utiliser FaMusic pour représenter un Morceau (Conteneur de fichiers) */}
                    <FaMusic size={20} className="score-icon" />
                    <span className="score-name">{track.name}</span>
                </div>
                <div className="score-details">
                    <span className="score-format">Voir les fichiers</span>
                    <FaChevronRight size={14} className="details-arrow" /> {/* Flèche de navigation */}
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
        profilePic: '../assets/ensemble-pic.jpg',
        lastTrack: {
            id: 10, // ID du morceau ajouté
            title: "What's My Name ?",
            ensemble: "Ensemble : Snoop Dogg",
            year: 2025
        }
    };

    const ensembleId = ensemble.id;

    return (
        <div className="details-container">
            <Header />

            {/* Bannière "Fiche Ensemble" */}

            <main className="details-main">
                <div className="details-content-card fiche-card">

                    {/* Infos de l'ensemble (Haut de la carte) */}
            
                    {/* Lien vers la liste des membres */}
                    <a href={`/ensembles/${ensembleId}/membres`} className="members-link" title="Voir la liste des membres et gérer l'équipe">
                        Liste des membres ({ensemble.membersCount}) <FaChevronRight size={12} />
                    </a>

                    {/* Dernière Track */}
                    <h3 className="section-title">Dernière Track :</h3>
                    <a
                        href={`/ensembles/${ensembleId}/morceaux/${ensemble.lastTrack.id}`}
                        className="last-track-link"
                        title={`Voir les détails du morceau: ${ensemble.lastTrack.title}`}
                    >
                        <div className="last-track-box">
                            <FaMusic size={40} className="track-icon" />
                            <div className="track-info">
                                <p className="track-title-name">{ensemble.lastTrack.title}</p>
                                <p className="track-subtitle">{ensemble.lastTrack.ensemble}</p>
                                <p className="track-subtitle">{ensemble.lastTrack.year}</p>
                            </div>
                        </div>
                    </a>
                    {/* FIN DU LIEN */}

                    {/* Fichiers et Audios */}
                    <h3 className="section-title">Morceaux (Partitions & Audios) :</h3> {/* Titre mis à jour */}
                    {/* Ajouter un fichier */}
                    <div className="add-file-section">
                        {/* Ce lien mène à la page d'ajout de fichier pour cet ensemble */}
                        <a href={`/ensembles/${ensembleId}/ajouter-fichier`}>
                            <button className="add-file-button">
                                <FaPlus size={14} /> Ajouter un fichier (Partition/Audio)
                            </button>
                        </a>
                    </div>

                    {/* LISTE DES MORCEAUX (Utilisation du composant TrackItem) */}
                    <h4 className="subsection-title">Liste des morceaux :</h4> {/* Titre mis à jour */}
                    <div className="scores-list">
                        {mockTracks.map(track => (
                            <TrackItem
                                key={track.id}
                                track={track}
                                ensembleId={ensembleId}
                            />
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