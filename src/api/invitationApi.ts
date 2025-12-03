export interface CreateInvitationDTO {
  emailInvite: string;
  ensembleId: number;
}
// DTO pour représenter une invitation reçue depuis le backend
export interface InvitationDTO {
  id: number;
  emailInvite: string;
  nom?: string;
  role?: string | null;
  ensembleId: number;
  ensembleNom?: string;
  etat?: string;
  dateEnvoi?: string; // date en texte
  token?: string;
  utilisateurId?: number; // ← ajouté
  existant?: boolean; // ← ajouté
  dejaMembre?: boolean; // optionnel si ton backend le renvoie
}
interface Invitation {
  id: number;
  utilisateurNom?: string;
  emailInvite: string;
  etat?: string;
  role?: string;
  message?: string;
  photoUrl?: string;
  instrument?: string;
}


export const API_BASE_URL = "http://localhost:8080/api";

/**
 * Crée une invitation pour un utilisateur dans un ensemble.
 * Gère les doublons d'email selon le backend (status 400).
 *
 * @param emailInvite L'email de l'utilisateur à inviter
 * @param ensembleId L'ID de l'ensemble
 * @throws Erreur si la requête échoue
 */
export const creerInvitation = async (
  emailInvite: string,
  ensembleId: number
) => {
  const body = JSON.stringify({ emailInvite, ensembleId });

  const response = await fetch(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
 // Gestion des erreurs
  if (!response.ok) {
    const errorData = await response.json();
    const err: any = new Error(errorData?.error || "Erreur serveur");
    err.response = { status: response.status };
    throw err;
  }

  return await response.json(); // InvitationDTO
};

// Récupération des invitations pour un ensemble
export async function getInvitations(
  ensembleId: number
): Promise<InvitationDTO[]> {
  const response = await fetch(`/api/invitations/ensemble/${ensembleId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la récupération des invitations"
    );
  }
  const data: InvitationDTO[] = await response.json();
  return data;
}

// Récupération du rôle via token
export async function getRole(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/invitations/role/${token}`);
    if (!response.ok) {
      return null; // utilisateur pas encore inscrit ou token invalide
    }
    const role = await response.text();
    return role;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle :", error);
    return null;
  }
}

// Récupération des invitations avec le rôle de chaque utilisateur
export async function getInvitationsWithRoles(
  ensembleId: number
): Promise<InvitationDTO[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/invitations/ensemble/${ensembleId}`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des invitations");
    const invitations: InvitationDTO[] = await response.json();

    const invitationsWithRoles = await Promise.all(
      invitations.map(async (inv) => {

        // Si l'invitation a un token, on appelle getRole
        // Sinon on met null
        const role = inv.token ? await getRole(inv.token) : null;
        return { ...inv, role };
      })
    );

    return invitationsWithRoles;
  } catch (error) {
    console.error("Erreur dans getInvitationsWithRoles :", error);
    throw error;
  }
}

/**
 * Rattache un utilisateur existant à un ensemble
 * @param utilisateurId ID de l'utilisateur
 * @param ensembleId ID de l'ensemble
 * @returns message de confirmation du backend
 */
export const rattacherUtilisateur = async (
  utilisateurId: number,
  ensembleId: number
) => {
  const response = await fetch(`${API_BASE_URL}/invitations/rattacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ utilisateurId, ensembleId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const err: any = new Error(errorData?.error || "Erreur serveur");
    err.response = { status: response.status };
    throw err;
  }

  return await response.json(); // { message: "Vous êtes maintenant rattaché à l'ensemble." }
};
