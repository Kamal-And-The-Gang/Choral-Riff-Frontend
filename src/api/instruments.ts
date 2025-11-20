// src/api/instruments.ts

export interface InstrumentDto {
  nom: string;
}

export const addInstrumentToEnsemble = async (
  ensembleId: number,
  utilisateurId: number,
  instrument: InstrumentDto
) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/instruments/${ensembleId}/add?utilisateurId=${utilisateurId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instrument),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erreur API: ${text}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Erreur dans addInstrumentToEnsemble:", error);
    throw error;
  }
};
