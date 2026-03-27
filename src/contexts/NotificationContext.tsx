
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
  rejectInvitation,
} from "../api/NotificationApi";
import {
  rattacherUtilisateur,
  rattacherUtilisateurApresInscription,
} from "../api/invitationApi";

type NotificationContextType = {
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: number, isRead: boolean) => Promise<void>;
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
    notificationId: number,
    ensembleId: number,
    action: "accept" | "reject"
  ) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

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
        ...n,
        status: (n.status ?? n.etat ?? "EN_ATTENTE") as InvitationStatus,
        valid: n.valid ?? true,
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
        await markSingleNotificationAsRead(notificationId, isRead);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead } : n
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
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Toutes les notifications ont été marquées comme lues.");
    } catch (error) {
      console.error("Erreur lors du marquage de tout comme lu:", error);
      toast.error("Erreur lors du marquage de tout comme lu.");
    }
  }, [user?.id]);

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
            prev.map((n) =>
              n.invitationId === invitationId
                ? { ...n, status, isRead: true, message: response.message }
                : n
            )
          );
          navigate(`/ensembles/${ensembleId}`);
        } else {
          await rejectInvitation(invitationId);
          setNotifications((prev) =>
            prev.map((n) =>
              n.invitationId === invitationId
                ? { ...n, status, isRead: true }
                : n
            )
          );
        }
        toast.success(`Invitation ${actionText} avec succès !`);
      } catch (error: any) {
        console.error(`Erreur lors de l'action ${actionText}:`, error);
        toast.error(`Erreur lors de ${actionText} l'invitation.`);
      }
    },
    [navigate, user]
  );

  const handleInvitationAfterSignup = useCallback(
    async (nouvelUtilisateur: any, invitation: any) => {
      try {
        await rattacherUtilisateurApresInscription(
          nouvelUtilisateur,
          invitation
        );
        await loadNotifications();
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



  const handleRattachementAction = useCallback(
    async (
      notificationId: number,
      ensembleId: number,
      action: "accept" | "reject"
    ) => {
      try {
        const url =
          action === "accept"
            ? `http://localhost:8080/api/notifications/accepter/${notificationId}`
            : `http://localhost:8080/api/notifications/refuser/${notificationId}`;

        await fetch(url, { method: "POST" });

        // Supprime la notification du state local
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        toast.success(
          action === "accept"
            ? "Rattachement accepté !"
            : "Rattachement refusé !"
        );

        if (action === "accept") {
          navigate(`/ensembles/${ensembleId}`);
        }
      } catch (error: any) {
        console.error("Erreur lors du rattachement :", error);
        toast.error("Impossible de traiter le rattachement.");
      }
    },
    [navigate]
  );





  const contextValue = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    handleInvitation,
    handleInvitationAfterSignup,
    handleRattachementAction,
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