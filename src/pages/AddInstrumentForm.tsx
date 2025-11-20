// import React, { useState } from "react";

// interface AddInstrumentFormProps {
//   onSubmit: (instrument: string) => void;
// }

// const AddInstrumentForm: React.FC<AddInstrumentFormProps> = ({ onSubmit }) => {
//   const [instrument, setInstrument] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (instrument.trim()) {
//       onSubmit(instrument);
//       setInstrument("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Nom de l’instrument :
//         <input
//           type="text"
//           value={instrument}
//           onChange={(e) => setInstrument(e.target.value)}
//         />
//       </label>
//       <button type="submit">Ajouter</button>
//     </form>
//   );
// };

// export default AddInstrumentForm;
import React, { useState } from "react";

interface AddInstrumentFormProps {
  ensembleId: number; // id de l'ensemble pour créer le DTO
  onSubmit: (instrument: { id?: number; nom: string; ensembleId: number }) => void;
  onClose: () => void;
}

const AddInstrumentForm: React.FC<AddInstrumentFormProps> = ({ ensembleId, onSubmit, onClose }) => {
  const [nom, setNom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    // On crée le DTO côté frontend
    const instrumentDto = { nom, ensembleId };
    onSubmit(instrumentDto);
    setNom("");
  };

  return (
    <div className="modal-content">
      <h3>Ajouter un instrument</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'instrument"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <div className="modal-buttons">
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInstrumentForm;
