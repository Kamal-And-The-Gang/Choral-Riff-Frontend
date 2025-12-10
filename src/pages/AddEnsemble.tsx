import React, { useState, useEffect } from "react";
import "../styles/AuthForms.css";
import "../styles/AddEnsemble.css";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type TypeEnsemble =
  | "Chorale"
  | "Orchestre"
  | "Quatuor"
  | "Groupe de Rock"
  | "Autre";

const ensembleTypes: TypeEnsemble[] = [
  "Chorale",
  "Orchestre",
  "Quatuor",
  "Groupe de Rock",
  "Autre",
];

type Ensemble = {
  id: string;
  nom: string;
  description: string;
  typeEnsemble: TypeEnsemble;
  createdBy: string;
  userRole: "ADMIN" | "MODERATEUR" | "MEMBRE";
  creator?: boolean; // <-- ajout
};
/**
 *
 * @returns
 */

export const AddEnsemble = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [ensembleType, setEnsembleType] = useState<TypeEnsemble>("Chorale");
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [description, setDescription] = useState("");
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const { user, token, updateUserRole } = useAuth();

  useEffect(() => {
    if (!ensembleId || !user) return;

    console.log("Fetching ensembleId:", ensembleId, "userId:", user.id);

    fetch(
      `http://localhost:8080/api/ensembles/${ensembleId}/forUser/${user.id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Ensemble non trouvé");
        return res.json();
      })
      .then((data) => {
        setName(data.nom);
        setDescription(data.description);
        setEnsembleType(data.typeEnsemble);
        setEnsemble(data);
      })
      .catch((err) => {
        toast.error("Erreur chargement de l'ensemble : " + err.message);
      });
  }, [ensembleId, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier que l'utilisateur est connecté et que son id est valide
    if (!user?.id) {
      toast.error(
        "Impossible de récupérer un userId valide. Veuillez vous reconnecter."
      );
      return;
    }
    // Vérifie si c'est une modification
    // if (ensembleId && Number(ensemble?.createdBy) !== user?.id) {
    //   toast.error("Seul le créateur peut modifier cet ensemble.");
    //   return;
    // }
    if (
      ensembleId &&
      ensemble?.userRole !== "MODERATEUR" &&
      ensemble?.userRole !== "ADMIN"
    ) {
      toast.error("Vous n'avez pas les droits pour modifier cet ensemble.");
      return;
    }

    // création du corps de message
    const payload = {
      nom: name,
      typeEnsemble: ensembleType,
      description,
      createdBy: user?.id,
    };

    try {
      // Construire l'URL selon création ou modification
      const url = ensembleId
        ? `http://localhost:8080/api/ensembles/${ensembleId}?userId=${user.id}`
        : `http://localhost:8080/api/ensembles?userId=${user.id}`;

      const response = await fetch(url, {
        method: ensembleId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          ensembleId
            ? "Erreur lors de la mise à jour"
            : "Erreur lors de la création"
        );
      }

      const data = await response.json();
      const newEnsembleId = data.id;
      const isEditing = !!ensembleId;

      // Mise à jour du rôle seulement si c'est une création
      if (!isEditing) {
        updateUserRole(newEnsembleId.toString(), "admin");
      }

      //  Mise à jour du contexte pour que l'utilisateur devienne admin
      if (!ensembleId) {
        updateUserRole(newEnsembleId.toString(), "admin");
      }

      toast.success(
        ensembleId
          ? "Ensemble modifié avec succès !"
          : "Ensemble créé avec succès !"
      );

      // Redirection avec message correct
      navigate("/ensembles", {
        state: {
          refresh: true,
          successMessage: isEditing ? "Ensemble modifié !" : "Ensemble créé !",
        },
      });
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    }
  };

  return (
    <div className="add-ensemble-container">
      <main className="auth-main">
        <h1 className="form-title">
          {ensembleId ? "Modifier l'ensemble" : "Créer un nouvel ensemble"}
        </h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="form-label">
            Nom de l'ensemble
          </label>
          <input
            type="text"
            id="name"
            placeholder="Ex: Le Choeur des Riffs"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="type" className="form-label">
            Type d'ensemble
          </label>
          <select
            id="type"
            className="form-input select-input"
            value={ensembleType}
            onChange={(e) => setEnsembleType(e.target.value as TypeEnsemble)}
            required
          >
            {ensembleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label htmlFor="description" className="form-label">
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            placeholder="Brève description de votre ensemble..."
            className="form-input textarea-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="submit-button validate-button">
            <FaPlus /> {ensembleId ? "Modifier l'ensemble" : "Créer l'ensemble"}
          </button>
        </form>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
