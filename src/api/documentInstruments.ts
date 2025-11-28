// src/api/documentInstruments.ts
import axios from "axios";

export const handleAddInstrumentSubmit = async (
  documentId: number,
  instrument: { id?: number; nom: string }
) => {
  let instrumentId = instrument.id;

  if (!instrumentId) {
    const res = await axios.post("http://localhost:8080/api/instruments", {
      nom: instrument.nom,
    });
    instrumentId = res.data.id;
  }

  await axios.post(
    `http://localhost:8080/api/documents/${documentId}/instruments`,
    null,
    { params: { instrumentId } }
  );
};

