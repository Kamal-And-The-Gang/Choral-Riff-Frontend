import { toast } from "react-toastify";

const BASE_URL = "https://localhost/api/ensembles";

/**
 * Récupère un ensemble par son ID
 * @param {string} id - ID de l'ensemble
 */
export const fetchEnsembleById = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Erreur lors du chargement de l'ensemble");
    return res.json();
  } catch (err: any) {
    toast.error("Erreur chargement de l'ensemble : " + err.message);
    throw err;
  }
};

/**
 * Crée ou modifie un ensemble
 * @param {object} payload - Données de l'ensemble
 * @param {string | null} id - ID de l'ensemble (null si création)
 * @param {string} token - Token d'authentification
 */
export const saveEnsemble = async (payload: any, id: string | null, token: string) => {
  const url = id ? `${BASE_URL}/${id}` : `${BASE_URL}?userId=${payload.createdBy}`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(id ? "Erreur lors de la mise à jour" : "Erreur lors de la création");
  }

  return res.json();
};
