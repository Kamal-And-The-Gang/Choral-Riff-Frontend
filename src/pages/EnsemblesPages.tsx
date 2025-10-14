import React from 'react';
import '../styles/MonEspace.css';
import { FaUsers, FaPlus } from 'react-icons/fa';

import ensembleBanner from '../assets/banniere-mon-espace.jpg';
import userProfilePic from '../assets/avatar-michelle.jpg';


// --- TYPAGES ET DONNÉES (Gardées) ---
interface Ensemble {
    id: number;
    name: string;
    members: number;
    type: string;
}
interface EnsembleListItemProps {
    ensemble: Ensemble;
}
const ensembleData: Ensemble[] = [
    { id: 1, name: "Les enfants de Dr Dre", members: 11, type: "Chorale" },
    { id: 2, name: "Red Hot Chili Peppers", members: 4, type: "Quatuor" },
    { id: 3, name: "Orchestre Lyrique", members: 75, type: "Orchestre" },
    { id: 4, name: "Harmonie Municipale", members: 42, type: "Orchestre d'Harmonie" },
];

const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => (
    <a href={`/ensembles/${ensemble.id}`} className="ensemble-list-item-link">
        <div className="ensemble-card">
            <FaUsers size={40} className="ensemble-icon" />
            <div className="ensemble-details">
                <h3>{ensemble.name}</h3>
                <p>Type : {ensemble.type}</p>
                <p>{ensemble.members} membres</p>
            </div>
            <button className="view-ensemble-button">Voir les partitions</button>
        </div>
    </a>
);


export const EnsemblesPage = () => {
    return (
        <div className="ensembles-container">

            {/* 1. Section Bannière (inchangé) */}
            <section className="ensembles-banner" style={{ backgroundImage: `url(${ensembleBanner})` }}>
                <div className="banner-overlay">
                    <h2>Mon espace</h2>
                </div>
            </section>

            <main className="ensembles-main">

                {/* 2. Section Profil (inchangé) */}
                <div className="profile-section">
                    <img
                        src={userProfilePic}
                        alt="Photo de profil"
                        className="profile-pic"
                    />
                    <div className="profile-info">
                        <p className="profile-name">Michelle Leeb</p>
                    </div>
                </div>

                {/* 3. Liste des Ensembles : RETRAIT DU CONTENEUR ENGLOBANT */}
                
                    <section className="ensembles-list-section"> 

                        <div className="ensembles-header-section">
                            <h2>Mes Ensembles Musicaux</h2>
                        </div>

                        <div className="ensembles-list">
                            {ensembleData.map(ensemble => (
                                <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
                            ))}
                        </div>

                        <div className="add-ensemble-footer-button">
                            <a href="/ajouter-ensemble">
                                <button className="submit-button">
                                    <FaPlus /> Créer un nouvel ensemble
                                </button>
                            </a>
                        </div>
                    </section>

            </main>

        </div>
    );
};