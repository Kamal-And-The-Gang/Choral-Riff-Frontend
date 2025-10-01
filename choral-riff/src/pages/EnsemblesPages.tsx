// src/pages/Ensembles.tsx

import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/EnsemblesPages.css';
import { FaPlus } from 'react-icons/fa'; 

// Importer les images que vous utiliserez ici
import ensembleBanner from '../assets/banniere-mon-espace.jpg'; 
import userProfilePic from '../assets/avatar-michelle.jpg'; 

// ... (Définition de EnsembleCard et des types) ...
type EnsembleCardProps = {
    id: number; 
    name: string;
    image: string;
};

const EnsembleCard: React.FC<EnsembleCardProps> = ({ id, name, image }) => (
    <a href={`/ensembles/${id}`} className="ensemble-card-link">
        <div className="ensemble-card-item">
            <img src={image} alt={name} className="ensemble-image" />
            <span className="ensemble-name">{name}</span>
        </div>
    </a>
);
// ... (Fin de la définition de EnsembleCard) ...


export const EnsemblesPage = () => {
    // Données fictives
    const ensembles = [
        { id: 1, name: "Les enfants de Dr Dre", image: '../assets/ensemble-1.jpg' },
        { id: 2, name: "Le Chœur Allegro", image: '../assets/ensemble-2.jpg' },
        { id: 3, name: "Orchestre Lyrique", image: '../assets/ensemble-3.jpg' },
    ];
    
    return (
        <div className="ensembles-container">
            <Header />

            {/* ... (Code de la bannière et de la section profil) ... */}
            <section className="ensembles-banner" style={{ backgroundImage: `url(${ensembleBanner})` }}>
                <div className="banner-overlay">
                    <h2>Mon espace</h2>
                </div>
            </section>

            <main className="ensembles-main">
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

                {/* Section Contenu Principal (Carte Mes ensembles) */}
                <div className="ensembles-content-card">
                    <h3 className="card-title">Mes ensembles</h3>
                    
                    <div className="ensembles-list-grid">
                        {ensembles.map(ensemble => (
                            <EnsembleCard 
                                key={ensemble.id} 
                                id={ensemble.id}
                                name={ensemble.name} 
                                image={ensemble.image} 
                            />
                        ))}
                    </div>
                    
                    {/* LIEN AJOUTÉ ICI pour lier le bouton à la nouvelle page */}
                    <div className="add-ensemble-footer">
                        {/* Utilisation de <a> autour du <button> */}
                        <a href="/ajouter-ensemble"> 
                            <button className="add-ensemble-button">
                                <FaPlus /> Créer un nouvel ensemble
                            </button>
                        </a>
                    </div>
                    {/* FIN DU LIEN AJOUTÉ */}

                </div>

            </main>
            
            <Footer /> 
        </div>
    );
};