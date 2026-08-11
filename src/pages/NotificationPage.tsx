
import React, { useState, useMemo } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationItem from "../components/NotificationItem";
import Spinner from "./Spinner";
import type { NotificationType } from "../types/notificationTypes";
import "../styles/NotificationPage.css";

const NotificationPage: React.FC = () => {
  const { notifications, loading, markAllAsRead, unreadCount } = useNotifications();

  const [filterType, setFilterType] = useState<NotificationType | "ALL">("ALL");
  const [filterReadStatus, setFilterReadStatus] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;


  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notif) => {
        if (notif.valid === false) return false;
        if (filterType === "RATTACHEMENT") {
          if (notif.type !== "RATTACHEMENT" && notif.type !== "DEMANDE_RATTACHEMENT") return false;
        } else if (filterType !== "ALL" && notif.type !== filterType) return false;
        if (filterReadStatus === "UNREAD" && notif.isRead) return false;
        if (filterReadStatus === "READ" && !notif.isRead) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, filterType, filterReadStatus]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  return (
    <div className="notification-page-container">
      <h2>Mes notifications 🎵</h2>

      <div className="controls-section">
        <div className="filters">
          <label>
            Type :
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as NotificationType | "ALL")}
            >
              <option value="ALL">Tous les types</option>
              <option value="INVITATION">Invitations</option>
              <option value="MORCEAU_AJOUTE">Morceaux ajoutés</option>
              <option value="INSTRUMENT_AJOUTE">Instrument ajouté</option>
              <option value="RATTACHEMENT">Rattachement</option>
              <option value="DOCUMENT">Documents</option>
              <option value="GENERAL">Général</option>
            </select>
          </label>

          <label>
            Statut :
            <select
              value={filterReadStatus}
              onChange={(e) => setFilterReadStatus(e.target.value as "ALL" | "UNREAD" | "READ")}
            >
              <option value="ALL">Tous</option>
              <option value="UNREAD">Non lus ({unreadCount})</option>
              <option value="READ">Lus</option>
            </select>
          </label>
        </div>

        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Marquer tout comme lu
          </button>
        )}
      </div>

      <div className="notification-list-full">
        {loading ? (
          <Spinner message="Chargement des notifications..." />
        ) : filteredNotifications.length === 0 ? (
          <p className="no-results">Aucune notification trouvée selon les filtres appliqués.</p>
        ) :

          (
            paginatedNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onActionComplete={() => { }}
              />
            ))
          )



        }
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Précédent
          </button>

          <span>{currentPage} / {totalPages}</span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;