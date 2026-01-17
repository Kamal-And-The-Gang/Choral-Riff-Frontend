import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/morceaux";

export type MorceauCreationDto = {
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
};

export type DernierMorceauAPI = {
  id: number;
  titre: string;
  compositeur: string;
  genre: string;
  ensembleId: number;
};

/**
 * [POST] Ajoute un nouveau morceau via l'API.
 * @param morceau Les données de création du morceau.
 * @returns Le morceau créé (si l'API renvoie l'objet)
 */
export const createMorceau = async (
  morceau: MorceauCreationDto,
): Promise<DernierMorceauAPI> => {
  // L'URL est directement '/api/morceaux'
  const response = await axios.post<DernierMorceauAPI>(API_BASE_URL, morceau);
  return response.data;
};

/**
 * [GET] Récupère le morceau le plus récemment ajouté.
 * @returns Le morceau le plus récent ou null si aucun n'est trouvé.
 */
export const getLastMorceau = async (): Promise<DernierMorceauAPI | null> => {
  try {
    // L'URL est '/api/morceaux/last'
    const response = await axios.get<DernierMorceauAPI>(`${API_BASE_URL}/last`);
    return response.data;
  } catch (error) {
    // Gérer le cas où l'API renvoie 404 (comme configuré dans MorceauController)
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Retourne null si aucun morceau n'est trouvé
    }
    // Pour toute autre erreur (erreur serveur 500, réseau, etc.), on la propage
    console.error("Erreur lors de la récupération du dernier morceau:", error);
    throw error;
  }
};

/**
 * [GET] Récupère le morceau le plus récemment ajouté pour un ensemble spécifique.
 * * NOTE: Cette fonction suppose que vous avez créé l'endpoint back-end correspondant
 * (ex: /api/morceaux/ensemble/{ensembleId}/last).
 * * @param ensembleId L'ID de l'ensemble
 * @returns Le morceau le plus récent de cet ensemble ou null.
 */

export const getLastMorceauByEnsemble = async (
  ensembleId: number,
): Promise<DernierMorceauAPI | null> => {
  try {
    const url = `${API_BASE_URL}/ensemble/${ensembleId}/last`;
    const response = await axios.get<DernierMorceauAPI>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(
      `Erreur lors de la récupération du dernier morceau pour l'ensemble ${ensembleId}:`,
      error,
    );
    throw error;
  }
};
