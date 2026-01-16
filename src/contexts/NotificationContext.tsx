import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import type {
  NotificationDTO,
  InvitationStatus,
  NotificationType,
} from "../types/notificationTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getNotificationsByUserId,
  markSingleNotificationAsRead,
  markAllNotificationsAsRead,
  acceptInvitation,
  rejectInvitation,
} from "../api/NotificationApi";
import { mockNotifications } from "../api/mockNotifications";
import {
  rattacherUtilisateur,
  rattacherUtilisateurApresInscription,
} from "../api/invitationApi"; //  Import de la nouvelle fonction
import axios from "axios";

const IS_DEV_MODE = import.meta.env.MODE !== "production";

// --- Définition du Contexte ---
type NotificationContextType = {
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: number, isRead: boolean) => Promise<void>; // Mise à jour ici
  markAllAsRead: () => Promise<void>;
  handleInvitation: (
    invitationId: number,
    ensembleId: number,
    action: "accept" | "reject"
  ) => Promise<void>;
  handleInvitationAfterSignup: (
    nouvelUtilisateur: any,
    invitation: any
  ) => Promise<void>;
  handleRattachementAction: (
    ensembleId: number,
    action: "accept" | "reject"
  ) => Promise<void>; // <-- Ajout de cette ligne
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// --- Provider ---
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);

    try {
      const data = await getNotificationsByUserId(user.id);

      const formattedNotifications: NotificationDTO[] = data.map((n) => ({
        id: n.id,
        type: n.type.includes("INVITATION")
          ? (n.type as NotificationType)
          : (n.type as NotificationType),
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
        ensembleId: n.ensembleId,
        ensembleNom: n.ensembleNom,
        invitationId: n.invitationId,
        status: (n.status ?? n.etat ?? "EN_ATTENTE") as InvitationStatus,

        senderName: n.senderName,
        token: n.token,
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId: number, isRead: boolean) => {
      try {
        // Appel API (si ton API accepte le readState)
        await markSingleNotificationAsRead(notificationId, isRead);

        // Mise à jour locale
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, isRead: isRead } // Utiliser l'état isRead
              : notif
          )
        );
      } catch (error) {
        console.error("Erreur lors du marquage comme lu:", error);
        toast.error("Erreur lors de la mise à jour du statut.");
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      toast.success("Toutes les notifications ont été marquées comme lues.");
    } catch (error) {
      console.error("Erreur lors du marquage de tout comme lu:", error);
      toast.error("Erreur lors du marquage de tout comme lu.");
    }
  }, [user?.id]);

  // === Gestion classique des invitations via bouton ===
  const handleInvitation = useCallback(
    async (
      invitationId: number,
      ensembleId: number,
      action: "accept" | "reject"
    ) => {
      const status: InvitationStatus =
        action === "accept" ? "ACCEPTEE" : "REFUSEE";
      const actionText = action === "accept" ? "Accepter" : "Refuser";

      try {
        if (action === "accept") {
          const response = await rattacherUtilisateur(user!.id, ensembleId);
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.invitationId === invitationId
                ? { ...notif, status, isRead: true, message: response.message }
                : notif
            )
          );
        } else {
          await rejectInvitation(invitationId);
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.invitationId === invitationId
                ? {
                    ...notif,
                    status,
                    isRead: true,
                    message: `Vous avez refusé l'ensemble ${notif.ensembleNom}.`,
                  }
                : notif
            )
          );
        }

        toast.success(`Invitation ${actionText} avec succès !`);

        if (action === "accept") {
          navigate(`/ensembles/${ensembleId}`);
        }
      } catch (error: any) {
        console.error(`Erreur lors de l'action ${actionText}:`, error);
        toast.error(`Erreur lors de ${actionText} l'invitation.`);
      }
    },
    [navigate, user]
  );

  //  Nouvelle fonction pour le flux automatique après inscription
  const handleInvitationAfterSignup = useCallback(
    async (nouvelUtilisateur: any, invitation: any) => {
      try {
        await rattacherUtilisateurApresInscription(
          nouvelUtilisateur,
          invitation
        );

        // Recharger les notifications pour refléter l'état ACCEPTEE
        await loadNotifications();

        // Naviguer vers l'ensemble
        navigate(`/ensembles/${invitation.ensembleId}`);

        toast.success(
          `Vous avez été ajouté automatiquement à l'ensemble ${invitation.ensembleNom} !`
        );
      } catch (error) {
        console.error("Erreur lors du rattachement automatique :", error);
        toast.error("Impossible de rattacher l'invitation après inscription.");
      }
    },
    [loadNotifications, navigate]
  );

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  // Ajout de la fonction handleRattachement dans NotificationContext.tsx

  const handleRattachementAction = useCallback(
    async (ensembleId: number, action: "accept" | "reject") => {
      try {
        if (action === "accept") {
          // Appel à la fonction rattacherUtilisateur pour rattacher l'utilisateur
          const response = await rattacherUtilisateur(user!.id, ensembleId);

          if (response.notificationId) {
            const newNotif: NotificationDTO = {
              id: response.notificationId,
              type: "RATTACHEMENT",
              message: response.message,
              isRead: false,
              createdAt: new Date().toISOString(),
              ensembleId,
              ensembleNom: "", // à remplir si tu récupères le nom de l'ensemble
              invitationId: undefined,
              status: "EN_ATTENTE",
              senderName: user?.nom || "",
              token: "",
            };

            // Ajouter la notification au state
            setNotifications((prev) => [...prev, newNotif]);
          }

          toast.success("Rattachement accepté !");
        } else {
          // Refuser le rattachement
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.ensembleId === ensembleId
                ? {
                    ...notif,
                    status: "REFUSEE",
                    isRead: true,
                    message: `Vous avez refusé le rattachement à ${notif.ensembleNom}.`,
                  }
                : notif
            )
          );
          toast.info("Rattachement refusé !");
        }
      } catch (error) {
        console.error("Erreur lors du rattachement :", error);
        toast.error("Impossible de traiter le rattachement.");
      }
    },
    [user]
  );

  // Ajout de `handleRattachement` dans le contexte
  const contextValue = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    handleInvitation,
    handleInvitationAfterSignup,
    handleRattachementAction, // Ajout ici
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
