import React, { useState } from 'react';
import '../styles/AuthForms.css'; 
import '../styles/AddEnsemble.css'; 
import { FaUpload, FaFileAlt } from 'react-icons/fa';

// Fausse donnée pour l'ensemble (devrait être dynamique)
const ensembleName = "Les enfants de Dr Dre";

// Morceaux existants simulés pour l'ensemble
const mockMorceaux = [
    { id: 1, title: "What's My Name ?" },
    { id: 2, title: "Nuthin' but a 'G' Thang" },
];

export const AddMorceau = () => {
    const [file, setFile] = useState<File | null>(null);
    // Remplacer 'title' par la logique de morcea
    const [existingMorceauId, setExistingMorceauId] = useState<string>(''); // Utilise 'string' pour 'new' ou l'ID numérique
    const [newMorceauTitle, setNewMorceauTitle] = useState<string>('');
    
    const [instrument, setInstrument] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Logique de l'UI
    const isNewMorceau = existingMorceauId === 'new';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            // Optionnel : pré-remplir le titre si l'utilisateur crée un nouveau morceau
            if (isNewMorceau) {
                 // Retire l'extension du nom de fichier pour le titre
                 setNewMorceauTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert("Veuillez sélectionner un fichier à téléverser.");
            return;
        }
        if (isNewMorceau && !newMorceauTitle.trim()) {
            alert("Veuillez donner un titre au nouveau morceau.");
            return;
        }

        const morceauIdentifier = isNewMorceau ? 
            `Nouveau morceau : ${newMorceauTitle}` : 
            `Morceau ID: ${existingMorceauId} (${mockMorceaux.find(t => t.id === Number(existingMorceauId))?.title || 'Inconnu'})`;


        setIsUploading(true);
        setTimeout(() => {
            alert(`Fichier "${file.name}" téléversé !
            Associé à : ${morceauIdentifier}
            Rôle : ${instrument}`);
            setIsUploading(false);
            // Réinitialiser
            setFile(null);
            setExistingMorceauId('');
            setNewMorceauTitle('');
            setInstrument('');
        }, 2000);
    };

    return (
        <div className="add-file-container">
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
                        
                        {/* 2. Liaison au Morceau (EXISTANT ou NOUVEAU) */}
                        <label htmlFor="morceau-link" className="form-label">Lier à un morceau</label>
                        <select 
                            id="morceau-link"
                            className="form-input select-input"
                            value={existingMorceauId}
                            onChange={(e) => setExistingMorceauId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Associer à un morceau...</option>
                            <option value="new" style={{ fontWeight: 'bold' }}>➕ Créer un nouveau morceau</option>
                            {/* Séparateur visuel */}
                            <option disabled>--- Morceaux existants ---</option>
                            {mockMorceaux.map(morceau => (
                                <option key={morceau.id} value={morceau.id.toString()}>
                                    {morceau.title}
                                </option>
                            ))}
                        </select>

                        {/* Champ pour le NOUVEAU TITRE (apparaît si "Créer un nouveau morceau" est sélectionné) */}
                        {isNewMorceau && (
                            <>
                                <label htmlFor="new-title" className="form-label">Titre du nouveau morceau</label>
                                <input 
                                    type="text" 
                                    id="new-title"
                                    placeholder="Nom du nouveau morceau (Ex: What's My Name ?)" 
                                    className="form-input" 
                                    value={newMorceauTitle}
                                    onChange={(e) => setNewMorceauTitle(e.target.value)}
                                    required
                                />
                            </>
                        )}


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
                            // Condition de désactivation mise à jour
                            disabled={isUploading || !file || (isNewMorceau && !newMorceauTitle.trim())}
                        >
                            <FaUpload /> {isUploading ? "Téléversement..." : "Téléverser le fichier"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};