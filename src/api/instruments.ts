// // src/api/instruments.ts

// export interface InstrumentDto {
//   nom: string;
// }

// export const addInstrumentToEnsemble = async (
//   ensembleId: number,
//   utilisateurId: number,
//   instrument: InstrumentDto
// ) => {
//   try {
//     const res = await fetch(
//       `http://localhost:8080/api/instruments/${ensembleId}/add?utilisateurId=${utilisateurId}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(instrument),
//       }
//     );

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Erreur API: ${text}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Erreur dans addInstrumentToEnsemble:", error);
//     throw error;
//   }
// };

// export interface InstrumentDto {
//   id: number;         // obligatoire pour lier à un document
//   nom: string;
  
// }



// export const getInstrumentsByEnsemble = async (ensembleId: number) => {
//   const res = await fetch(
//     `http://localhost:8080/api/instruments/${ensembleId}`
//   );
//   if (!res.ok) throw new Error("Impossible de récupérer les instruments");
//   return await res.json(); // renvoie un tableau { id: number, nom: string }[]
// };

// export interface InstrumentDto {
//   id: number; // obligatoire pour lier à un document
//   nom: string;
//   ensembleIds?: number[];
// }

// // --- Ajouter un instrument à un document ---
// export const addInstrumentToDocument = async (documentId: number, instrumentId: number) => {
//   try {
//     const res = await fetch(
//       `http://localhost:8080/api/documents/${documentId}/instruments/${instrumentId}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Erreur API: ${text}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Erreur dans addInstrumentToDocument:", error);
//     throw error;
//   }
// };
