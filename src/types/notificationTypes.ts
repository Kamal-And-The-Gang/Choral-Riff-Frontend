export type NotificationType =
  | "INVITATION"
  | "MORCEAU_AJOUTE"
  | "INSTRUMENT_AJOUTE" // <-- nouveau type
  | "GENERAL"
  | "RATTACHEMENT" // ← nouveau type pour l’admin qui rattache
  | "DEMANDE_RATTACHEMENT"; // ← nouveau type pour l’admin qui rattache

export type InvitationStatus = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE";

export type NotificationDTO = {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;

  // Contexte
  ensembleId?: number;
  ensembleNom?: string;

  // Spécifique à l'invitation
  invitationId?: number;
  status?: InvitationStatus;
  etat?: InvitationStatus;
  senderName?: string;

  // Pour accepter/refuser via backend
  token?: string;

  // <-- nouveau champ
  utilisateurId?: number;

  // ← nouveau champ
  morceauTitre?: string;

  // <-- Ajouter le champ valid
  valid?: boolean;



  // Pour instruments
  documentId?: number; // <-- nouveau champ facultatif
};
