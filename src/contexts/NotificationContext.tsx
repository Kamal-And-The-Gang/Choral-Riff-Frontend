import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import type { NotificationDTO, InvitationStatus } from '../types/notificationTypes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
    getNotificationsByUserId, 
    markSingleNotificationAsRead, 
    markAllNotificationsAsRead, 
    acceptInvitation, 
    rejectInvitation 
} from '../api/NotificationApi'; // 💡 Import des fonctions API
import { mockNotifications } from '../api/mockNotifications';

const IS_DEV_MODE = process.env.NODE_ENV !== 'production';



// --- Définition du Contexte ---
type NotificationContextType = {
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  handleInvitation: (invitationId: number, ensembleId: number, action: 'accept' | 'reject') => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// --- Provider ---
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);


 const loadNotifications = useCallback(async () => {
    if (!user) {
        setNotifications([]);
        return;
    }
    setLoading(true);
    
    // --- DÉBUT LOGIQUE DE TEST ---
    if (IS_DEV_MODE) {
        console.log("MODE DEV: Chargement des notifications factices.");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simule un délai réseau
        setNotifications(mockNotifications);
        setLoading(false);
        return; 
    }
    // --- FIN LOGIQUE DE TEST ---

    try {
        const data = await getNotificationsByUserId(user.id);
        setNotifications(data);
    } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
        setNotifications([]); 
    } finally {
        setLoading(false);
    }
}, [user]);


  // Marquer une seule notification comme lue (utilise NotificationApi.ts)
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await markSingleNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      toast.error('Erreur lors de la mise à jour du statut.');
    }
  }, []);

  // Marquer toutes les notifications comme lues (utilise NotificationApi.ts)
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      toast.success('Toutes les notifications ont été marquées comme lues.');
    } catch (error) {
      console.error('Erreur lors du marquage de tout comme lu:', error);
      toast.error('Erreur lors du marquage de tout comme lu.');
    }
  }, [user?.id]);


  // Gérer l'invitation (utilise NotificationApi.ts)
  const handleInvitation = useCallback(async (invitationId: number, ensembleId: number, action: 'accept' | 'reject') => {
    const status: InvitationStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
    const actionText = action === 'accept' ? 'Accepter' : 'Refuser';

    try {
      if (action === 'accept') {
        await acceptInvitation(invitationId, ensembleId);
      } else {
        await rejectInvitation(invitationId);
      }
      
      // Mise à jour de l'état local
      setNotifications(prev => prev.map(notif => 
          notif.invitationId === invitationId ? 
          { 
            ...notif, 
            status: status, 
            isRead: true, 
            message: `Vous avez ${action === 'accept' ? 'rejoint' : 'refusé'} l'ensemble ${notif.ensembleNom}.`
          } 
          : notif
      ));

      toast.success(`Invitation ${actionText} avec succès !`);
      
      if (action === 'accept') {
          navigate(`/ensembles/${ensembleId}`);
      }

    } catch (error) {
      console.error(`Erreur lors de l'action ${actionText}:`, error);
      toast.error(`Erreur lors de ${actionText} l'invitation.`);
    }
  }, [navigate]);


  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); 
      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  const contextValue = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    handleInvitation,
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
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};