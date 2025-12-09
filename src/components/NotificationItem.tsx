import React from 'react';
import type { NotificationDTO, NotificationType } from '../types/notificationTypes';
import { FaUserPlus, FaMusic, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/NotificationItem.css'; // Assurez-vous d'avoir ce fichier CSS

type NotificationItemProps = {
  notification: NotificationDTO;
  onActionComplete?: () => void; 
};

const getIconAndColor = (type: NotificationType) => {
  switch (type) {
    case 'INVITATION':
      return { icon: <FaUserPlus />, color: '#007bff' };
    case 'MORCEAU_AJOUTE':
      return { icon: <FaMusic />, color: '#28a745' };
    case 'GENERAL':
    default:
      return { icon: <FaInfoCircle />, color: '#6c757d' };
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onActionComplete }) => {
  const { handleInvitation, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const { icon, color } = getIconAndColor(notification.type);

  const handleAction = async (action: 'accept' | 'reject') => {
    if (notification.invitationId && notification.ensembleId) {
      await handleInvitation(notification.invitationId, notification.ensembleId, action);
      if (onActionComplete) {
        onActionComplete();
      }
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Logique de navigation (si action non requise)
    if (notification.ensembleId && notification.type !== 'INVITATION') {
        navigate(`/ensembles/${notification.ensembleId}`);
    }
    if (onActionComplete) {
      onActionComplete();
    }
  };

  const isPendingInvitation = notification.type === 'INVITATION' && notification.status === 'PENDING';

  return (
    <div 
      className={`notification-item ${!notification.isRead ? 'notification-unread' : ''}`}
      onClick={!isPendingInvitation ? handleClick : undefined}
      style={{ cursor: isPendingInvitation ? 'default' : 'pointer' }}
    >
      <div className="notification-icon" style={{ color: color }}>
        {icon}
      </div>

      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <span className="notification-date">{new Date(notification.createdAt).toLocaleString()}</span>

        {isPendingInvitation && (
          <div className="invitation-actions-container">
            <button 
              className="action-btn accept-btn" 
              onClick={(e) => { e.stopPropagation(); handleAction('accept'); }}
            >
              <FaCheckCircle size={14} /> Accepter
            </button>
            <button 
              className="action-btn reject-btn" 
              onClick={(e) => { e.stopPropagation(); handleAction('reject'); }}
            >
              <FaTimesCircle size={14} /> Refuser
            </button>
          </div>
        )}

        {notification.type === 'INVITATION' && notification.status !== 'PENDING' && (
          <span className={`invitation-status ${notification.status?.toLowerCase()}`}>
            Statut : {notification.status === 'ACCEPTED' ? 'Rejoint' : 'Refusé'}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;