import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import { Link } from 'react-router-dom';
import Spinner from '../pages/Spinner';
// import '../styles/NotificationPopUp.css'; // Assurez-vous d'avoir ce fichier CSS

type NotificationPopUpProps = {
    onClose: () => void;
}

const NotificationPopUp: React.FC<NotificationPopUpProps> = ({ onClose }) => {
  const { notifications, loading } = useNotifications();

  // Afficher seulement les 5 premières notifications non lues
  const recentNotifications = notifications
    .filter(n => !n.isRead)
    .slice(0, 5);

  return (
    <div className="notification-popup-container">
      <h4 className="popup-title">Notifications Récentes</h4>

      {loading ? (
        <Spinner message="Chargement..." />
      ) : recentNotifications.length === 0 ? (
        <p className="no-notifications">Aucune notification non lue.</p>
      ) : (
        <div className="popup-list">
          {recentNotifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onActionComplete={onClose} 
            />
          ))}
        </div>
      )}
      
      <div className="popup-footer">
        <Link to="/notifications" onClick={onClose} className="view-all-link">
          Voir toutes les notifications ({notifications.length})
        </Link>
      </div>
    </div>
  );
};

export default NotificationPopUp;