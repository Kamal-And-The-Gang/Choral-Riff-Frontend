import axios from "axios";
import type { NotificationDTO } from "../types/notificationTypes";

const NOTIFICATION_API_BASE_URL = "http://localhost:8080/api/notifications";
const INVITATION_API_BASE_URL = "http://localhost:8080/api/invitations";

/**
 * [GET] Récupère toutes les notifications pour un utilisateur donné.
 * @param userId L'ID de l'utilisateur connecté.
 */

export const getNotificationsByUserId = async (
  userId: number
): Promise<NotificationDTO[]> => {
  const response = await axios.get<NotificationDTO[]>(
    `${NOTIFICATION_API_BASE_URL}?utilisateurId=${userId}`
  );
  return response.data;
};

/**
 * [POST] Marque une seule notification comme lue.
 * @param notificationId L'ID de la notification à marquer.
 */
export const markSingleNotificationAsRead = async (
  notificationId: number,
  isRead: boolean
): Promise<void> => {
  try {
    await axios.put(`${NOTIFICATION_API_BASE_URL}/${notificationId}/read`, {
      isRead, // <-- envoie l'état souhaité au backend
    });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du statut de la notification ${notificationId}:`,
      error
    );
    throw error;
  }
};

/**
 * [POST] Marque toutes les notifications non lues d'un utilisateur comme lues.
 * @param userId L'ID de l'utilisateur.
 */
export const markAllNotificationsAsRead = async (
  userId: number
): Promise<void> => {
  try {
    await axios.post(`${NOTIFICATION_API_BASE_URL}/read-all`, { userId });
  } catch (error) {
    console.error(
      `Erreur lors du marquage de toutes les notifications pour l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * [POST] Accepte une invitation.
 * @param invitationId L'ID de l'invitation.
 * @param ensembleId L'ID de l'ensemble.
 */
export const acceptInvitation = async (
  invitationId: number,
  ensembleId: number
): Promise<void> => {
  try {
    await axios.post(
      `${INVITATION_API_BASE_URL}/${invitationId}/accept`,
      null,
      {
        params: { ensembleId: ensembleId },
      }
    );
  } catch (error) {
    console.error(
      `Erreur lors de l'acceptation de l'invitation ${invitationId}:`,
      error
    );
    throw error;
  }
};

/**
 * [POST] Refuse une invitation.
 * @param invitationId L'ID de l'invitation.
 */
export const rejectInvitation = async (invitationId: number): Promise<void> => {
  try {
    await axios.post(`${INVITATION_API_BASE_URL}/${invitationId}/reject`);
  } catch (error) {
    console.error(
      `Erreur lors du refus de l'invitation ${invitationId}:`,
      error
    );
    throw error;
  }
};
