// import React, { useState, useEffect } from "react";
// import type {
//   NotificationDTO,
//   NotificationType,
// } from "../types/notificationTypes";
// import {
//   FaUserPlus,
//   FaMusic,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../contexts/NotificationContext";
// import "../styles/NotificationItem.css";
// import toast from "react-hot-toast";

// type NotificationItemProps = {
//   notification: NotificationDTO;
//   onActionComplete?: () => void;
// };

// const getIconAndColor = (type: NotificationType) => {
//   switch (type) {
//     case "INVITATION":
//       return { icon: <FaUserPlus />, color: "#007bff" };
//     case "MORCEAU_AJOUTE":
//       return { icon: <FaMusic />, color: "#28a745" };
//     case "RATTACHEMENT": // Rattachement => orange
//       return { icon: <FaUserPlus />, color: "#ff9900" };
//       case "DEMANDE_RATTACHEMENT": // Demande de rattachement => orange aussi
//       return { icon: <FaUserPlus />, color: "#ff9900" };
//     case "GENERAL":
//     default:
//       return { icon: <FaInfoCircle />, color: "#6c757d" };
//   }
// };

// const NotificationItem: React.FC<NotificationItemProps> = ({
//   notification,
//   onActionComplete,
// }) => {
//   const { handleRattachementAction, markAsRead } = useNotifications();
//   const navigate = useNavigate();
//   const { icon, color } = getIconAndColor(notification.type);
//   const [isRead, setIsRead] = useState(notification.isRead);

//   // Fonction pour gérer l'action du rattachement
//   const handleAction = async (action: "accept" | "reject") => {
//     if (notification.ensembleId) {
//       // Appel à handleRattachementAction pour accepter ou refuser le rattachement
//       await handleRattachementAction(notification.ensembleId, action);
//       if (onActionComplete) onActionComplete(); // Callback si nécessaire
//     }
//   };

//   // Fonction pour gérer le clic sur la notification (marquer comme lue et navigation)
//   const handleClick = async () => {
//     if (!isRead) {
//       await markAsRead(notification.id, true); // Marquer comme lue
//       setIsRead(true);
//     }
//     if (notification.ensembleId && notification.type !== "INVITATION") {
//       navigate(`/ensembles/${notification.ensembleId}`);
//     }
//     if (onActionComplete) onActionComplete(); // Callback si nécessaire
//   };

//   // Vérification du type de notification
// const isRattachementNotification = notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

//   // return (
//   //   <div
//   //     className={`notification-item ${
//   //       !isRead ? "notification-unread" : "notification-read"
//   //     }`}
//   //     onClick={!isRattachementNotification ? handleClick : undefined}
//   //     style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
//   //   >
//   //     <div className="notification-icon" style={{ color }}>
//   //       {icon}
//   //     </div>

//   //     <div className="notification-content">
//   //       <p className="notification-message">{notification.message}</p>
//   //       <span className="notification-date">
//   //         {new Date(notification.createdAt).toLocaleString()}
//   //       </span>

//   //       {/* Affichage des boutons Accepter/Refuser pour les notifications de type RATTACHEMENT */}
//   //       {isRattachementNotification && (
//   //         <div className="rattachement-actions-container">
//   //           <button
//   //             className="action-btn accept-btn"
//   //             onClick={(e) => {
//   //               e.stopPropagation(); // Empêche la propagation du clic
//   //               handleAction("accept"); // Appel de la fonction pour accepter le rattachement
//   //             }}
//   //           >
//   //             <FaCheckCircle size={14} /> Accepter
//   //           </button>
//   //           <button
//   //             className="action-btn reject-btn"
//   //             onClick={(e) => {
//   //               e.stopPropagation();
//   //               handleAction("reject"); // Appel de la fonction pour refuser le rattachement
//   //             }}
//   //           >
//   //             <FaTimesCircle size={14} /> Refuser
//   //           </button>
//   //         </div>
//   //       )}

//   //       {/* {isRattachementNotification && (
//   //         <div className="rattachement-actions-container">
//   //           <button
//   //             className="action-btn reject-btn"
//   //             onClick={async (e) => {
//   //               e.stopPropagation();
//   //               // Appelle la fonction handleLeaveEnsemble depuis le contexte
//   //               // await handleLeaveEnsemble(notification.ensembleId);
//   //             }}
//   //           >
//   //             <FaTimesCircle size={14} /> Quitter l'ensemble
//   //           </button>
//   //         </div>
//   //       )} */}

//   //       {/* Case à cocher pour marquer comme lu */}
//   //       <div className="notification-read-toggle">
//   //         <label>
//   //           <input
//   //             type="checkbox"
//   //             checked={isRead}
//   //             onChange={async (e) => {
//   //               const newIsRead = e.target.checked;
//   //               await markAsRead(notification.id, newIsRead);
//   //               setIsRead(newIsRead);
//   //             }}
//   //           />
//   //           Lu
//   //         </label>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// return (
//   <div
//     className={`notification-item ${!isRead ? "notification-unread" : "notification-read"}`}
//     onClick={!isRattachementNotification ? handleClick : undefined}
//     style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
//   >
//     <div className="notification-icon" style={{ color }}>
//       {icon}
//     </div>

//     <div className="notification-content">
//       <p className="notification-message">{notification.message}</p>
//       <span className="notification-date">
//         {new Date(notification.createdAt).toLocaleString()}
//       </span>

//       {/* Affichage des boutons Accepter/Refuser pour les notifications de type RATTACHEMENT et DEMANDE_RATTACHEMENT */}
//       {isRattachementNotification && (
//         <div className="rattachement-actions-container">
//           <button
//             className="action-btn accept-btn"
//             onClick={(e) => {
//               e.stopPropagation(); // Empêche la propagation du clic
//               handleAction("accept"); // Appel de la fonction pour accepter le rattachement
//             }}
//           >
//             <FaCheckCircle size={14} /> Accepter
//           </button>
//           <button
//             className="action-btn reject-btn"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleAction("reject"); // Appel de la fonction pour refuser le rattachement
//             }}
//           >
//             <FaTimesCircle size={14} /> Refuser
//           </button>
//         </div>
//       )}

//       {/* Case à cocher pour marquer comme lu */}
//       <div className="notification-read-toggle">
//         <label>
//           <input
//             type="checkbox"
//             checked={isRead}
//             onChange={async (e) => {
//               const newIsRead = e.target.checked;
//               await markAsRead(notification.id, newIsRead);
//               setIsRead(newIsRead);
//             }}
//           />
//           Lu
//         </label>
//       </div>
//     </div>
//   </div>
// );











// };

// export default NotificationItem;
import React, { useState, useEffect } from "react";
import type { NotificationDTO, NotificationType } from "../types/notificationTypes";
import { FaUserPlus, FaMusic, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import "../styles/NotificationItem.css";
import toast from "react-hot-toast";

type NotificationItemProps = {
  notification: NotificationDTO;
  onActionComplete?: () => void;
};

const getIconAndColor = (type: NotificationType) => {
  switch (type) {
    case "INVITATION":
      return { icon: <FaUserPlus />, color: "#007bff" };
    case "MORCEAU_AJOUTE":
      return { icon: <FaMusic />, color: "#28a745" };
    case "RATTACHEMENT": // Rattachement => orange
      return { icon: <FaUserPlus />, color: "#ff9900" };
    case "DEMANDE_RATTACHEMENT": // Demande de rattachement => orange aussi
      return { icon: <FaUserPlus />, color: "#ff9900" };
    case "GENERAL":
    default:
      return { icon: <FaInfoCircle />, color: "#6c757d" };
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onActionComplete }) => {
  const { handleRattachementAction, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const { icon, color } = getIconAndColor(notification.type);
  const [isRead, setIsRead] = useState(notification.isRead);
  const [hasActioned, setHasActioned] = useState(notification.status !== "EN_ATTENTE");

  // Fonction pour gérer l'action du rattachement
  // const handleAction = async (action: "accept" | "reject") => {
  //   if (notification.ensembleId) {
  //     // Appel à handleRattachementAction pour accepter ou refuser le rattachement
  //     await handleRattachementAction(notification.ensembleId, action);
  //     setHasActioned(true); // Indique que l'action a été effectuée
  //     if (onActionComplete) onActionComplete(); // Callback si nécessaire
  //   }
  // };

  const handleAction = async (action: "accept" | "reject") => {
  if (notification.ensembleId) {
    await handleRattachementAction(notification.id, notification.ensembleId, action);
    setHasActioned(true);
    if (onActionComplete) onActionComplete();
  }
};


  // Fonction pour gérer le clic sur la notification (marquer comme lue et navigation)
  const handleClick = async () => {
    if (!isRead) {
      await markAsRead(notification.id, true); // Marquer comme lue
      setIsRead(true);
    }
    if (notification.ensembleId && notification.type !== "INVITATION") {
      navigate(`/ensembles/${notification.ensembleId}`);
    }
    if (onActionComplete) onActionComplete(); // Callback si nécessaire
  };

  // Vérification du type de notification
  const isRattachementNotification = notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

  // Retourner la notification avec les boutons seulement si elle est en attente
  return (
    <div
      className={`notification-item ${!isRead ? "notification-unread" : "notification-read"}`}
      onClick={!isRattachementNotification ? handleClick : undefined}
      style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
    >
      <div className="notification-icon" style={{ color }}>
        {icon}
      </div>

      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <span className="notification-date">
          {new Date(notification.createdAt).toLocaleString()}
        </span>

        {/* Affichage des boutons Accepter/Refuser pour les notifications de type RATTACHEMENT et DEMANDE_RATTACHEMENT */}
        {isRattachementNotification && !hasActioned && (
          <div className="rattachement-actions-container">
            <button
              className="action-btn accept-btn"
              onClick={(e) => {
                e.stopPropagation(); // Empêche la propagation du clic
                handleAction("accept"); // Accepter le rattachement
              }}
            >
              <FaCheckCircle size={14} /> Accepter
            </button>
            <button
              className="action-btn reject-btn"
              onClick={(e) => {
                e.stopPropagation(); // Empêche la propagation du clic
                handleAction("reject"); // Refuser le rattachement
              }}
            >
              <FaTimesCircle size={14} /> Refuser
            </button>
          </div>
        )}

        {/* Case à cocher pour marquer comme lu */}
        <div className="notification-read-toggle">
          <label>
            <input
              type="checkbox"
              checked={isRead}
              onChange={async (e) => {
                const newIsRead = e.target.checked;
                await markAsRead(notification.id, newIsRead);
                setIsRead(newIsRead);
              }}
            />
            Lu
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
