import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FaUserCircle, FaPlus } from 'react-icons/fa';
import '../styles/Dashboard.css'; 

// --- TYPESCRIPT TYPES ---
type Ensemble = {
    id: number;
    name: string;
    profilePic: string; // URL de la photo de profil de l'ensemble
};

// --- DONNÉES FICTIVES ---
const mockUser = {
    name: "Michelle Leeb",
    profilePic: '../assets/michelle-profile.jpg' // Image de profil fictive
};

const mockEnsembles: Ensemble[] = [
    { id: 1, name: "Les enfants de Dr Dre", profilePic: '../assets/ensemble-pic-1.jpg' },
    { id: 2, name: "Le Chœur Allegro", profilePic: '../assets/ensemble-pic-2.jpg' },
    { id: 3, name: "Orchestre Lyrique", profilePic: '../assets/ensemble-pic-3.jpg' },
];

// --- COMPOSANTS INTERNES ---

// Composant pour la vignette de l'ensemble
const EnsembleVignette: React.FC<{ ensemble: Ensemble }> = ({ ensemble }) => {
    // Le lien mène à la Fiche Ensemble (EnsembleDetails)
    const ensembleLink = `/ensembles/${ensemble.id}`;
    
    return (
        <a href={ensembleLink} className="ensemble-vignette" title={`Ouvrir l'ensemble ${ensemble.name}`}>
            <div className="vignette-image-container">
                {/* Image de profil de l'ensemble */}
                <img src={ensemble.profilePic} alt={`Photo de ${ensemble.name}`} className="ensemble-vignette-pic" />
            </div>
            <span className="ensemble-vignette-name">{ensemble.name}</span>
        </a>
    );
};

// --- COMPOSANT PRINCIPAL ---
export const Dashboard = () => {
    // La route /dashboard ou /mon-espace mènera ici
    const user = mockUser; // Données utilisateur simulées

    return (
        <div className="dashboard-container">
            <Header />

            {/* Bannière de l'espace utilisateur (Mon espace) */}
            <section className="dashboard-header-section dashboard-banner">
                <div className="dashboard-title-box">
                    <h1 className="dashboard-title">Mon espace</h1>
                </div>
            </section>

            <main className="dashboard-main">
                <div className="dashboard-content-card">
                    
                    {/* Infos utilisateur */}
                    <div className="user-profile-info">
                        <FaUserCircle size={80} className="profile-icon" /> 
                        <h2 className="user-name">{user.name}</h2>
                    </div>

                    {/* Section Mes ensembles */}
                    <h3 className="section-title">Mes ensembles</h3>
                    
                    <div className="ensembles-grid">
                        {/* Affichage des ensembles */}
                        {mockEnsembles.map(ensemble => (
                            <EnsembleVignette key={ensemble.id} ensemble={ensemble} />
                        ))}
                    </div>

                    {/* Bouton Créer un nouvel ensemble */}
                    <div className="create-ensemble-section">
                        <a href="/creer-ensemble" className="create-ensemble-link">
                            <button className="create-ensemble-button">
                                <FaPlus size={18} /> Créer un nouvel ensemble
                            </button>
                        </a>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};