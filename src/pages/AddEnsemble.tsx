// src/pages/AddEnsemble.tsx

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/AuthForms.css'; 
import '../styles/AddEnsemble.css';
import { FaPlus } from 'react-icons/fa';

export const AddEnsemble = () => {
    const [name, setName] = useState('');
    const [ensembleType, setEnsembleType] = useState('Chorale');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`Nouvel ensemble créé : ${name} (${ensembleType})`);
        // Ici, la logique d'appel API pour créer l'ensemble
    };

    return (
        <div className="add-ensemble-container">
            <Header />

            <main className="auth-main"> 
                <h1 className="form-title">Créer un nouvel ensemble</h1>
                
                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        
                        {/* Champ 1 : Nom de l'ensemble */}
                        <label htmlFor="name" className="form-label">Nom de l'ensemble</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Ex: Le Choeur des Riffs" 
                            className="form-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />

                        {/* Champ 2 : Type d'ensemble (Sélection) */}
                        <label htmlFor="type" className="form-label">Type d'ensemble</label>
                        <select 
                            id="type"
                            className="form-input select-input"
                            value={ensembleType}
                            onChange={(e) => setEnsembleType(e.target.value)}
                            required
                        >
                            <option value="Chorale">Chorale</option>
                            <option value="Orchestre">Orchestre</option>
                            <option value="Quatuor">Quatuor</option>
                            <option value="Groupe de Rock">Groupe de Rock</option>
                            <option value="Autre">Autre</option>
                        </select>

                        {/* Champ 3 : Description (Optionnel) */}
                        <label htmlFor="description" className="form-label">Description (optionnelle)</label>
                        <textarea
                            id="description"
                            placeholder="Brève description de votre ensemble..."
                            className="form-input textarea-input"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        
                        <button type="submit" className="submit-button validate-button">
                            <FaPlus /> Créer l'ensemble
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};