import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import '../../styles/TrackDetails.css';
import { FaMusic, FaChevronLeft, FaFilePdf, FaHeadphones, FaDownload, FaPlayCircle } from 'react-icons/fa';
import type { FileItem } from './components/FileItemComponent';
import FileItemComponent from './components/FileItemComponent';

// --- COMPOSANT PRINCIPAL ---
export const TrackDetails = () => {
    // 1. UTILISATION DE useParms() POUR RÉCUPÉRER LES IDS DANS L'URL
    const { ensembleId: routeEnsembleId, trackId: routeTrackId } = useParams<{ ensembleId: string, trackId: string }>();

    // CONVERSION DES IDS EN NOMBRES (si nécessaire pour l'API)
    const currentEnsembleId = Number(routeEnsembleId);
    const currentTrackId = Number(routeTrackId);

    // 2. SIMULATION DE DONNÉES EN UTILISANT LES IDS DYNAMIQUES
    // NOTE : En production, vous feriez ici un appel API (useEffect)
    const trackData = {
        id: currentTrackId,
        title: "What's My Name ?",
        ensemble: "Les enfants de Dr Dre",
        ensembleId: currentEnsembleId,
        composer: "Snoop Dogg / Dr. Dre",
        year: 2025,
        lastUpdate: "01/10/2025",
    };

    const mockFiles: FileItem[] = [
        { id: 201, name: "Partition Complète (Conducteur)", type: 'partition', format: "PDF", size: "3.5 MB", role: "Conducteur" },
        { id: 202, name: "Partition : Soprano", type: 'partition', format: "MusicXML", size: "500 KB", role: "Soprano" },
        { id: 203, name: "Partition : Basse", type: 'partition', format: "PDF", size: "450 KB", role: "Basse" },
        { id: 204, name: "Piste de référence Audio", type: 'audio', format: "MP3", size: "6.2 MB", role: "Audio Général" },
        { id: 205, name: "Piste de travail : Ténor (Mix)", type: 'audio', format: "MP3", size: "6.0 MB", role: "Ténor" },
    ];

    return (
        <div className="track-details-container">
            {/* Bannière "Fiche Morceau" */}
            <section className="track-header-section detail-header">
                <div className="fiche-title-box">
                    <h1 className="fiche-title">Fiche Morceau (ID: {currentTrackId})</h1> {/* ID ajouté pour vérification */}
                </div>
            </section>

            <main className="details-main">
                <div className="details-content-card track-card">

                    {/* Infos du Morceau */}
                    <div className="track-info-header">
                        <FaMusic size={60} className="big-track-icon" />
                        <div className="track-info-details">
                            <h2>{trackData.title}</h2>
                            {/* Lien de retour dynamique vers l'ensemble parent */}
                            <p>Ensemble : <a href={`/ensembles/${trackData.ensembleId}`}>{trackData.ensemble}</a></p>
                            <p>Compositeur : {trackData.composer}</p>
                            <p>Année : {trackData.year}</p>
                            <p>Dernière maj : {trackData.lastUpdate}</p>
                        </div>
                    </div>

                    {/* Bouton de retour dynamique */}
                    <a href={`/ensembles/${trackData.ensembleId}`} className="back-link">
                        <FaChevronLeft size={12} /> Retour à l'ensemble
                    </a>

                    {/* Fichiers disponibles */}
                    <h3 className="section-title files-section-title">Fichiers disponibles :</h3>

                    <div className="files-list">
                        {mockFiles.map(file => (
                            <FileItemComponent key={file.id} file={file} />
                        ))}
                    </div>

                    {/* Actions globales */}
                    <div className="global-actions">
                        <button
                            className="download-all-button"
                            onClick={() => alert('Téléchargement de tous les fichiers...')}
                        >
                            <FaDownload size={18} /> Télécharger tous les fichiers
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};