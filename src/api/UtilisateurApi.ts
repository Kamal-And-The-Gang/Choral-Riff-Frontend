import axios from "axios";

export type Utilisateur = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photoProfil?: string;
};

/**
 * Récupère l'utilisateur connecté.
 */
export const fetchCurrentUser = async (): Promise<Utilisateur> => {
  const response = await axios.get<Utilisateur>(
    "http://localhost:8080/api/utilisateur/me",
    {
      withCredentials: true, // si tu utilises cookies/session
    }
  );
  return response.data;
};
/**
 * Met à jour la photo de profil de l'utilisateur connecté.
 */
export const updateProfilePhoto = async (file: File): Promise<Utilisateur> => {
  const formData = new FormData();
  formData.append("photoProfil", file);

  const response = await axios.post<Utilisateur>(
    "http://localhost:8080/api/utilisateur/me/photo",
    formData,
    {
      withCredentials: true, // si tu utilises cookies/session
    }
  );

  return response.data;
};
