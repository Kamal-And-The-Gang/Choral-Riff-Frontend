export interface CreateInvitationDTO {
  emailInvite: string;
  ensembleId: number;
}

export interface InvitationDTO {
  id: number;
  emailInvite: string;
  ensembleId: number;
  // autres champs si besoin...
}

export async function creerInvitation(invitationDTO: CreateInvitationDTO): Promise<InvitationDTO> {
  try {
    const payload = {
      emailInvite: invitationDTO.emailInvite,
      ensembleId: invitationDTO.ensembleId,
    };

    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de l’invitation');
    }

    const data: InvitationDTO = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur dans creerInvitation :', error);
    throw error;
  }
}
