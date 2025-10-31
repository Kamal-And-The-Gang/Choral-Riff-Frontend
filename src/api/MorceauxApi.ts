import axios from 'axios';

const API_BASE_URL = "https://localhost/api/morceaux";


export type MorceauCreationDto = {
    titre: string;
    compositeur: string;
    genre: string;
    ensembleId: number;
};

export type DernierMorceauAPI = {
    morceauId: number;
    titre: string;
    compositeur: string;
    genre: string;
    ensembleId: number; 
    // Ajoutez ici les autres champs pertinents comme l'utilisateur une fois implémenté
};


/**
 * [POST] Ajoute un nouveau morceau via l'API.
 * @param morceau Les données de création du morceau.
 * @returns Le morceau créé (si l'API renvoie l'objet)
 */
export const createMorceau = async (morceau: MorceauCreationDto): Promise<DernierMorceauAPI> => {
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