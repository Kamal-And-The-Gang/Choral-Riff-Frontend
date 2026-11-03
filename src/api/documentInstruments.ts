// src/api/documentInstruments.ts
import axios from "axios";

export const handleAddInstrumentSubmit = async (
  documentId: number,
  instrument: { id?: number; nom: string },
) => {
  let instrumentId = instrument.id;

  if (!instrumentId) {
    const res = await axios.post("http://localhost:8080/api/instruments", {
      nom: instrument.nom,
    });
    instrumentId = res.data.id;
  }

  // ← ajoute return et récupère la réponse
  const res = await axios.post(
    `http://localhost:8080/api/documents/${documentId}/instruments`,
    null,
    { params: { instrumentId } },
  );

  return res.data; // retourne le document avec les instruments mis à jour
};

export interface Instrument {
  id: number;
  nom: string;
}

export const getAllInstruments = async (): Promise<Instrument[]> => {
  const response = await axios.get<Instrument[]>(
    "http://localhost:8080/api/instruments",
  );
  return response.data;
};
