import React, { useState } from "react";
import axios from "axios";
import { FaTimes, FaSave } from "react-icons/fa";
// 🚨 Assurez-vous que le chemin est correct pour votre CSS
import "../styles/modal-simplifie.css";

const API_URL = "http://localhost:8080/api/morceaux";

// --- DÉFINITIONS DES TYPES DTO ---

// Type de l'objet envoyé au serveur (DTO de création)
interface MorceauCreationDto {
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number; // L'API attend un nombre
}

// Type de l'objet retourné par l'API (Morceau créé)
interface MorceauDTO {
  morceauId: number;
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
  // ... autres champs retournés par le backend
}

// Ajout des props onMorceauAdded pour l'actualisation
interface AjouterMorceauFormProps {
  onClose: () => void;
  onMorceauAdded?: () => void;
  ensembleId: number;
}

const AjouterMorceauForm: React.FC<AjouterMorceauFormProps> = ({
  onClose,
  onMorceauAdded,
  ensembleId,
}) => {
  const [titre, setTitre] = useState<string>("");
  const [compositeur, setCompositeur] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Validation simple de l'ID de l'ensemble
    if (!ensembleId) {
      setMessage("Erreur: L'ID de l'ensemble est manquant.");
      setIsSubmitting(false);
      return;
    }

    //  Utilisation du type DTO pour le payload
    const nouveauMorceau: MorceauCreationDto = {
      titre,
      compositeur,
      genre,
      ensembleId,
    };

    try {
      // Utilisation du type générique pour garantir le typage de la réponse
      const response = await axios.post<MorceauDTO>(API_URL, nouveauMorceau);

      setMessage(`Morceau "${response.data.titre}" ajouté avec succès !`);

      // APPEL DE LA FONCTION D'ACTUALISATION
      if (onMorceauAdded) {
        onMorceauAdded();
      }

      setTimeout(onClose, 1000);
    } catch (error) {
      let errorMessage =
        "Erreur lors de l'ajout du morceau. Veuillez réessayer.";
      if (axios.isAxiosError(error) && error.response?.data) {
        // Tente de récupérer un message d'erreur plus précis du backend
        errorMessage = error.response.data.message || errorMessage;
      }
      console.error("Erreur lors de l'ajout:", error);
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="form-title">Ajouter un nouveau morceau </h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Fermer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="titre">
            Titre
          </label>
          <input
            className="form-input"
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <label className="form-label" htmlFor="compositeur">
            Compositeur
          </label>
          <input
            className="form-input"
            id="compositeur"
            type="text"
            value={compositeur}
            onChange={(e) => setCompositeur(e.target.value)}
            required
          />

          <label className="form-label" htmlFor="genre">
            Genre
          </label>
          <input
            className="form-input"
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />

          {/* Affichage du message de succès/erreur */}
          {message && (
            <p
              className={`form-message ${
                message.includes("succès") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            // Désactivation si en cours de soumission ou si un champ requis est vide
            disabled={
              isSubmitting || !titre || !compositeur || !genre || !ensembleId
            }
          >
            <FaSave />{" "}
            {isSubmitting ? "Enregistrement..." : "Ajouter le Morceau"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterMorceauForm;
