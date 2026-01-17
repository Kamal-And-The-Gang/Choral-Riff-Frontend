import React, { useState } from "react";
import axios from "axios";
import { FaTimes, FaSave } from "react-icons/fa";
import "../styles/modal-simplifie.css";
import { useAuth } from "../contexts/AuthContext"; // <-- récupération du user
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/morceaux";

// --- DÉFINITIONS DES TYPES DTO ---

interface MorceauCreationDto {
  titre: string;
  compositeur: string;
  genre: string;
  descriptif?: string;
  ensembleId: number;
}

interface MorceauDTO {
  morceauId: number;
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
}

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
  const { user } = useAuth(); // <-- user connecté

  const [titre, setTitre] = useState<string>("");
  const [compositeur, setCompositeur] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [descriptif, setDescriptif] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Utilisateur non connecté !");
      return;
    }

    setIsSubmitting(true);

    const nouveauMorceau: MorceauCreationDto = {
      titre,
      compositeur,
      genre,
      descriptif,
      ensembleId,
    };

    try {
      // On passe userId via query param ou headers selon ton backend
      const response = await axios.post<MorceauDTO>(
        `${API_URL}?userId=${user.id}`,
        nouveauMorceau,
      );

      toast.success(`Morceau "${response.data.titre}" ajouté avec succès !`);

      if (onMorceauAdded) onMorceauAdded();
      setTimeout(onClose, 1000);
    } catch (error: any) {
      let errorMessage =
        "Erreur lors de l'ajout du morceau. Veuillez réessayer.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      console.error("Erreur lors de l'ajout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="form-title">Ajouter un nouveau morceau</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Fermer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Titre</label>
          <input
            className="form-input"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <label className="form-label">Compositeur</label>
          <input
            className="form-input"
            type="text"
            value={compositeur}
            onChange={(e) => setCompositeur(e.target.value)}
            required
          />

          <label className="form-label">Genre</label>
          <input
            className="form-input"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />

          <label className="form-label">Descriptif (optionnel)</label>
          <textarea
            className="form-input"
            value={descriptif}
            onChange={(e) => setDescriptif(e.target.value)}
          />

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !titre || !compositeur || !genre}
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
