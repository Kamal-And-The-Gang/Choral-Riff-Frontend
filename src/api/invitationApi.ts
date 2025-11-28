// export interface CreateInvitationDTO {
//   emailInvite: string;
//   ensembleId: number;
// }

// export interface InvitationDTO {
//   id: number;
//   emailInvite: string;
//   ensembleId: number;
// }

// export async function creerInvitation(
//   invitationDTO: CreateInvitationDTO
// ): Promise<InvitationDTO> {
//   try {
//     const payload = {
//       emailInvite: invitationDTO.emailInvite,
//       ensembleId: invitationDTO.ensembleId,
//     };

//     const response = await fetch("/api/invitations", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData.message || "Erreur lors de la création de l’invitation"
//       );
//     }

//     const data: InvitationDTO = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Erreur dans creerInvitation :", error);
//     throw error;
//   }
// }

export interface CreateInvitationDTO {
  emailInvite: string;
  ensembleId: number;
}

export interface InvitationDTO {
  nom: string;
  role: string | null;
  id: number;
  emailInvite: string;
  ensembleId: number;
  ensembleNom: string;
  etat: string;
  dateEnvoi: string; // date en texte
  token: string;
}

// Création d'une invitation
// export async function creerInvitation(
//   invitationDTO: CreateInvitationDTO
// ): Promise<InvitationDTO> {
//   try {
//     const payload = {
//       emailInvite: invitationDTO.emailInvite,
//       ensembleId: invitationDTO.ensembleId,
//     };

//     const response = await fetch("/api/invitations", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData.message || "Erreur lors de la création de l’invitation"
//       );
//     }

//     const data: InvitationDTO = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Erreur dans creerInvitation :", error);
//     throw error;
//   }
// }
// Création d'une invitation conforme au backend
// src/api/invitationApi.ts
export const API_BASE_URL = "http://localhost:8080/api";

/**
 * Crée une invitation pour un utilisateur dans un ensemble.
 * Gère les doublons d'email selon le backend (status 400).
 *
 * @param emailInvite L'email de l'utilisateur à inviter
 * @param ensembleId L'ID de l'ensemble
 * @throws Erreur si la requête échoue
 */
export const creerInvitation = async (emailInvite: string, ensembleId: number) => {
  const body = JSON.stringify({ emailInvite, ensembleId });

  const response = await fetch(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  // Gestion des erreurs exactement comme le backend
  if (!response.ok) {
    const errorData = await response.json(); // { error: "message exact" }
    const err: any = new Error(errorData?.error || "Erreur serveur");
    err.response = { status: response.status }; // status 400 = doublon, 404 = non trouvé
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
    const response = await fetch(
      `http://localhost:8080/api/invitations/role/${token}`
    );
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
// Récupération des invitations avec les rôles
export async function getInvitationsWithRoles(
  ensembleId: number
): Promise<InvitationDTO[]> {
  try {
    const response = await fetch(
      `http://localhost:8080/api/invitations/ensemble/${ensembleId}`
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des invitations");
    const invitations: InvitationDTO[] = await response.json();

    const invitationsWithRoles = await Promise.all(
      invitations.map(async (inv) => {
        const role = await getRole(inv.token);
        return { ...inv, role };
      })
    );

    return invitationsWithRoles;
  } catch (error) {
    console.error("Erreur dans getInvitationsWithRoles :", error);
    throw error;
  }
}
