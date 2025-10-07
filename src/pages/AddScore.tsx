
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/AuthForms.css'; 
import '../styles/AddEnsemble.css'; // Pour les labels et le textarea
import { FaUpload, FaFileAlt } from 'react-icons/fa';

// Fausse donnée pour l'ensemble (devrait être dynamique)
const ensembleName = "Les enfants de Dr Dre";

export const AddScore = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [instrument, setInstrument] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("Veuillez sélectionner un fichier à téléverser.");
            return;
        }

        setIsUploading(true);
        // Simuler un délai de téléversement de 2 secondes
        setTimeout(() => {
            alert(`Fichier "${file.name}" téléversé avec succès pour l'ensemble ${ensembleName} !`);
            setIsUploading(false);
            // Réinitialiser le formulaire
            setFile(null);
            setTitle('');
            setInstrument('');
        }, 2000);
    };

    return (
        <div className="add-file-container">
            <Header />

            <main className="auth-main">
                <h1 className="form-title">Ajouter un fichier à "{ensembleName}"</h1>
                
                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        
                        {/* 1. Zone de sélection de fichier */}
                        <label className="form-label" htmlFor="file-upload">
                            Sélectionner le fichier (Partition ou Audio)
                        </label>
                        <div className="file-upload-box">
                            <input 
                                type="file" 
                                id="file-upload" 
                                onChange={handleFileChange}
                                accept=".pdf,.xml,.mp3,.m4a,.wav" 
                                required
                                style={{ display: 'none' }} // Cache l'input natif
                            />
                            <label htmlFor="file-upload" className="custom-file-label">
                                <FaFileAlt size={20} />
                                {file ? file.name : "Cliquez pour parcourir les fichiers"}
                            </label>
                        </div>
                        
                        {/* 2. Titre du morceau */}
                        <label htmlFor="title" className="form-label">Titre du morceau</label>
                        <input 
                            type="text" 
                            id="title"
                            placeholder="Ex: Le Requiem de Riff" 
                            className="form-input" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                        />

                        {/* 3. Instrument/Rôle (Sélection) */}
                        <label htmlFor="instrument" className="form-label">Instrument / Rôle</label>
                        <select 
                            id="instrument"
                            className="form-input select-input"
                            value={instrument}
                            onChange={(e) => setInstrument(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner...</option>
                            <option value="Soprano">Soprano (Chorale)</option>
                            <option value="Violon">Violon 1</option>
                            <option value="Guitare">Guitare acoustique</option>
                            <option value="Audio Reference">Audio de Référence</option>
                            <option value="Score Complet">Partition Complète</option>
                        </select>
                        
                        <button 
                            type="submit" 
                            className="submit-button validate-button" 
                            disabled={isUploading || !file}
                        >
                            <FaUpload /> {isUploading ? "Téléversement..." : "Téléverser le fichier"}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};