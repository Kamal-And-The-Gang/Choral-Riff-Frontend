import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom'; 

import '../styles/Connexion.css'; 
import '../styles/AuthForms.css';

// Importez l'image pour la section bannière
import bannerImage from '../assets/registration-banner.jpg'; 

export const Connexion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`Tentative de connexion pour : ${email}`);
        // La logique api de connexion sera implémentée ici
    };

    return (
        <div className="inscription-container"> 
            <main className="form-section">
                <h1 className="form-title">Connexion</h1>
                
                <div className="form-card">
                    <form onSubmit={handleSubmit}> 
                        
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Votre adresse email" 
                            className="form-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Votre mot de passe" 
                            className="form-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        
                        {/* Lien "Mot de passe oublié" */}
                        <div className="forgot-password-link">
                            <Link to="/mot-de-passe-oublie" className="forgot-password-text">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        
                        <button type="submit" className="submit-button validate-button">
                            Se connecter
                        </button>
                    </form>

                    {/* Lien vers l'inscription */}
                    <p className="link-to-register">
                        Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
                    </p>
                </div>
            </main>

            {/* Section Bannière */}
            <section className="banner-section" style={{ backgroundImage: `url(${bannerImage})` }}>
                <div className="banner-overlay">
                    <p>
                        "Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"
                    </p>
                </div>
            </section>
        </div>
    );
};