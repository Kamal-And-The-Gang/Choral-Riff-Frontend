import React, { useState, useEffect } from "react";
import "../styles/AuthForms.css";
import "../styles/AddEnsemble.css";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AddEnsemble = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [ensembleType, setEnsembleType] = useState("Chorale");
  const [description, setDescription] = useState("");

  const [searchParams] = useSearchParams();
  const ensembleId = searchParams.get("id");
  const { user, token } = useAuth();

  /**
   *
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   *
   */

  useEffect(() => {
    if (ensembleId) {
      console.log("User connecté :", user);

      fetch(`http://localhost:8080/api/ensembles/${ensembleId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.nom);
          setDescription(data.description);
          setEnsembleType(data.type);
        })
        .catch((err) => {
          toast.error("Erreur chargement de l'ensemble : " + err.message);
        });
    }
  }, [ensembleId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier que l'utilisateur est connecté et que son id est valide
    if (!user?.id) {
      toast.error(
        "Impossible de récupérer un userId valide. Veuillez vous reconnecter."
      );
      return;
    }

    // création du corps de message
    const payload = {
      nom: name,
      type: ensembleType,
      description,
      createdBy: user?.id,
    };

    try {
      // Construire l'URL selon création ou modification
      const url = ensembleId
        ? `http://localhost:8080/api/ensembles/${ensembleId}`
        : `http://localhost:8080/api/ensembles?userId=${user.id}`;

      const response = await fetch(url, {
        method: ensembleId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      toast.success(
        ensembleId
          ? "Ensemble modifié avec succès !"
          : "Ensemble créé avec succès !"
      );

      // Redirection vers la page du nouvel ensemble ou des détails
      navigate(`/ensembles/${newEnsembleId}`);
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
            onChange={(e) => setEnsembleType(e.target.value)}
            required
          >
            <option value="Chorale">Chorale</option>
            <option value="Orchestre">Orchestre</option>
            <option value="Quatuor">Quatuor</option>
            <option value="Groupe de Rock">Groupe de Rock</option>
            <option value="Autre">Autre</option>
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
