// export default AddInstrumentForm;
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Instrument {
  id: number;
  nom: string;
}

interface AddInstrumentFormProps {
  ensembleId?: number;
  onSubmit: (instrument: {
    id?: number;
    nom: string;
    ensembleId?: number;
  }) => void;
  onClose: () => void;
}

const AddInstrumentForm: React.FC<AddInstrumentFormProps> = ({
  ensembleId,
  onSubmit,
  onClose,
}) => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedId, setSelectedId] = useState<number | "new">();
  const [newNom, setNewNom] = useState("");

  useEffect(() => {
    axios
      .get<Instrument[]>("http://localhost:8080/api/instruments")
      .then((res) => setInstruments(res.data))
      .catch((err) => console.error("Erreur récupération instruments :", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedId === "new" && newNom.trim()) {
      onSubmit({ nom: newNom, ensembleId });
    } else if (typeof selectedId === "number") {
      const instrument = instruments.find((i) => i.id === selectedId);
      if (instrument) {
        onSubmit({ id: instrument.id, nom: instrument.nom, ensembleId });
      }
    }

    setSelectedId(undefined);
    setNewNom("");
  };

  return (
    <div
      className="modal-content"
      style={{
        position: "relative",
        padding: "30px",
        background: "white",
        borderRadius: "8px",

        margin: "auto",

        maxHeight: "80vh", // hauteur maximale
        overflowY: "auto", // scroll si contenu trop grand
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)", // ombre plus prononcée
        zIndex: 1000,
      }}
    >
      {/* Croix pour fermer la modale */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "none",
          background: "transparent",
          fontSize: "24px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#333",
        }}
        aria-label="Fermer la modale"
      >
        ×
      </button>

      <h3>Ajouter un instrument</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Choisir un instrument :
          <select
            value={selectedId ?? ""}
            onChange={(e) =>
              setSelectedId(
                e.target.value === "new" ? "new" : Number(e.target.value)
              )
            }
            required
            style={{ marginTop: "8px", display: "block", width: "100%" }}
          >
            <option value="">-- Sélectionner --</option>
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.nom}
              </option>
            ))}
            <option value="new">Autre...</option>
          </select>
        </label>

        {selectedId === "new" && (
          <input
            type="text"
            placeholder="Nom de l'instrument"
            value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            required
            style={{ marginTop: "8px", display: "block", width: "100%" }}
          />
        )}

        <div
          className="modal-buttons"
          style={{ marginTop: "16px", textAlign: "right" }}
        >
          <button type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  );
};

export default AddInstrumentForm;
