export type NotificationType = 'INVITATION' | 'MORCEAU_AJOUTE' | 'GENERAL';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

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
  senderName?: string;
};