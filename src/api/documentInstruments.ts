export const addInstrumentToDocument = async (documentId: number, instrumentId: number) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/document-instruments/add?documentId=${documentId}&instrumentId=${instrumentId}`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erreur API: ${text}`);
    }

    return await res.json(); // renvoie le document mis à jour
  } catch (error) {
    console.error("Erreur dans addInstrumentToDocument:", error);
    throw error;
  }
};
