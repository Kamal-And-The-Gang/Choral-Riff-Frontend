
// // // import React, { useState, useEffect } from "react";
// // // import type { NotificationDTO, NotificationType } from "../types/notificationTypes";
// // // import { FaUserPlus, FaMusic, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
// // // import { useNavigate } from "react-router-dom";
// // // import { useNotifications } from "../contexts/NotificationContext";
// // // import "../styles/NotificationItem.css";
// // // import toast from "react-hot-toast";

// // // type NotificationItemProps = {
// // //   notification: NotificationDTO;
// // //   onActionComplete?: () => void;
// // // };

// // // const getIconAndColor = (type: NotificationType) => {
// // //   switch (type) {
// // //     case "INVITATION":
// // //       return { icon: <FaUserPlus />, color: "#007bff" };
// // //     case "MORCEAU_AJOUTE":
// // //       return { icon: <FaMusic />, color: "#28a745" };
// // //     case "RATTACHEMENT": // Rattachement => orange
// // //       return { icon: <FaUserPlus />, color: "#ff9900" };
// // //     case "DEMANDE_RATTACHEMENT": // Demande de rattachement => orange aussi
// // //       return { icon: <FaUserPlus />, color: "#ff9900" };
// // //        case "INSTRUMENT_AJOUTE":  // <-- nouveau
// // //       return { icon: <FaMusic />, color: "#17a2b8" }; // bleu clair par exemple
// // //     case "GENERAL":
// // //     default:
// // //       return { icon: <FaInfoCircle />, color: "#6c757d" };
// // //   }
// // // };

// // // const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onActionComplete }) => {
// // //   const { handleRattachementAction, markAsRead } = useNotifications();
// // //   const navigate = useNavigate();
// // //   const { icon, color } = getIconAndColor(notification.type);
// // //   const [isRead, setIsRead] = useState(notification.isRead);
// // //   const [hasActioned, setHasActioned] = useState(notification.status !== "EN_ATTENTE");



// // //   const handleAction = async (action: "accept" | "reject") => {
// // //     if (notification.ensembleId) {
// // //       await handleRattachementAction(notification.id, notification.ensembleId, action);
// // //       setHasActioned(true);
// // //       if (onActionComplete) onActionComplete();
// // //     }
// // //   };


// // //   // Fonction pour gérer le clic sur la notification (marquer comme lue et navigation)
// // //   const handleClick = async () => {
// // //     if (!isRead) {
// // //       await markAsRead(notification.id, true); // Marquer comme lue
// // //       setIsRead(true);
// // //     }
// // //     if (notification.ensembleId && notification.type !== "INVITATION") {
// // //       navigate(`/ensembles/${notification.ensembleId}`);
// // //     }
// // //     if (onActionComplete) onActionComplete(); // Callback si nécessaire
// // //   };

// // //   // Vérification du type de notification
// // //   const isRattachementNotification = notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

// // //   // Retourner la notification avec les boutons seulement si elle est en attente
// // //   return (
// // //     <div
// // //       className={`notification-item ${!isRead ? "notification-unread" : "notification-read"}`}
// // //       onClick={!isRattachementNotification ? handleClick : undefined}
// // //       style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
// // //     >
// // //       <div className="notification-icon" style={{ color }}>
// // //         {icon}
// // //       </div>

// // //       <div className="notification-content">
// // //         <p className="notification-message">{notification.message}</p>
// // //         <span className="notification-date">
// // //           {new Date(notification.createdAt).toLocaleString()}
// // //         </span>

// // //         {/* Affichage des boutons Accepter/Refuser pour les notifications de type RATTACHEMENT et DEMANDE_RATTACHEMENT */}
// // //         {isRattachementNotification && !hasActioned && (
// // //           <div className="rattachement-actions-container">
// // //             <button
// // //               className="action-btn accept-btn"
// // //               onClick={(e) => {
// // //                 e.stopPropagation(); // Empêche la propagation du clic
// // //                 handleAction("accept"); // Accepter le rattachement
// // //               }}
// // //             >
// // //               <FaCheckCircle size={14} /> Accepter
// // //             </button>
// // //             <button
// // //               className="action-btn reject-btn"
// // //               onClick={(e) => {
// // //                 e.stopPropagation(); // Empêche la propagation du clic
// // //                 handleAction("reject"); // Refuser le rattachement
// // //               }}
// // //             >
// // //               <FaTimesCircle size={14} /> Refuser
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Case à cocher pour marquer comme lu */}
// // //         <div className="notification-read-toggle">
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={isRead}
// // //               onChange={async (e) => {
// // //                 const newIsRead = e.target.checked;
// // //                 await markAsRead(notification.id, newIsRead);
// // //                 setIsRead(newIsRead);
// // //               }}
// // //             />
// // //             Lu
// // //           </label>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default NotificationItem;
// // import React, { useState } from "react";
// // import type { NotificationDTO, NotificationType } from "../types/notificationTypes";
// // import { FaUserPlus, FaMusic, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import { useNotifications } from "../contexts/NotificationContext";
// // import "../styles/NotificationItem.css";
// // import toast from "react-hot-toast";

// // type NotificationItemProps = {
// //   notification: NotificationDTO;
// //   onActionComplete?: () => void;
// // };

// // const getIconAndColor = (type: NotificationType) => {
// //   switch (type) {
// //     case "INVITATION":
// //       return { icon: <FaUserPlus />, color: "#007bff" };
// //     case "MORCEAU_AJOUTE":
// //       return { icon: <FaMusic />, color: "#28a745" };
// //     case "RATTACHEMENT":
// //     case "DEMANDE_RATTACHEMENT":
// //       return { icon: <FaUserPlus />, color: "#ff9900" };
// //     case "INSTRUMENT_AJOUTE":
// //       return { icon: <FaMusic />, color: "#17a2b8" };
// //     case "GENERAL":
// //     default:
// //       return { icon: <FaInfoCircle />, color: "#6c757d" };
// //   }
// // };

// // const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onActionComplete }) => {
// //   const { handleRattachementAction, markAsRead } = useNotifications();
// //   const navigate = useNavigate();
// //   const { icon, color } = getIconAndColor(notification.type);
// //   const [isRead, setIsRead] = useState(notification.isRead);

// //   const handleAction = async (action: "accept" | "reject") => {
// //     if (notification.ensembleId) {
// //       await handleRattachementAction(notification.id, notification.ensembleId, action);
// //       if (onActionComplete) onActionComplete();
// //     }
// //   };

// //   const handleClick = async () => {
// //     if (!isRead) {
// //       await markAsRead(notification.id, true);
// //       setIsRead(true);
// //     }
// //     if (notification.ensembleId && notification.type !== "INVITATION") {
// //       navigate(`/ensembles/${notification.ensembleId}`);
// //     }
// //     if (onActionComplete) onActionComplete();
// //   };

// //   const isRattachementNotification =
// //     notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

// //   return (
// //     <div
// //       className={`notification-item ${!isRead ? "notification-unread" : "notification-read"}`}
// //       onClick={!isRattachementNotification ? handleClick : undefined}
// //       style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
// //     >
// //       <div className="notification-icon" style={{ color }}>
// //         {icon}
// //       </div>

// //       <div className="notification-content">
// //         <p className="notification-message">{notification.message}</p>
// //         <span className="notification-date">
// //           {new Date(notification.createdAt).toLocaleString()}
// //         </span>

// //         {/* Affichage des boutons seulement pour les notifications de rattachement */}
// //         {isRattachementNotification && (
// //           <div className="rattachement-actions-container">
// //             <button
// //               className="action-btn accept-btn"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 handleAction("accept");
// //               }}
// //             >
// //               <FaCheckCircle size={14} /> Accepter
// //             </button>
// //             <button
// //               className="action-btn reject-btn"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 handleAction("reject");
// //               }}
// //             >
// //               <FaTimesCircle size={14} /> Refuser
// //             </button>
// //           </div>
// //         )}

// //         <div className="notification-read-toggle">
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={isRead}
// //               onChange={async (e) => {
// //                 const newIsRead = e.target.checked;
// //                 await markAsRead(notification.id, newIsRead);
// //                 setIsRead(newIsRead);
// //               }}
// //             />
// //             Lu
// //           </label>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NotificationItem;

// import React, { useState } from "react";
// import type { NotificationDTO, NotificationType } from "../types/notificationTypes";
// import { FaUserPlus, FaMusic, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../contexts/NotificationContext";
// import "../styles/NotificationItem.css";

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
//     case "RATTACHEMENT":
//     case "DEMANDE_RATTACHEMENT":
//       return { icon: <FaUserPlus />, color: "#ff9900" };
//     case "INSTRUMENT_AJOUTE":
//       return { icon: <FaMusic />, color: "#17a2b8" };
//     case "GENERAL":
//     default:
//       return { icon: <FaInfoCircle />, color: "#6c757d" };
//   }
// };

// const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onActionComplete }) => {
//   const { handleRattachementAction, markAsRead } = useNotifications();
//   const navigate = useNavigate();
//   const { icon, color } = getIconAndColor(notification.type);

//   const [isRead, setIsRead] = useState(notification.isRead);
//   const [hasActioned, setHasActioned] = useState(notification.status !== "EN_ATTENTE");

//   // Gestion des actions Accepter / Refuser
//   const handleAction = async (action: "accept" | "reject") => {
//     if (notification.ensembleId) {
//       await handleRattachementAction(notification.id, notification.ensembleId, action);
//       setHasActioned(true); // Les boutons disparaissent
//       if (onActionComplete) onActionComplete();
//     }
//   };

//   // Gestion du clic sur la notification (marquer comme lu et navigation)
//   const handleClick = async () => {
//     if (!isRead) {
//       await markAsRead(notification.id, true);
//       setIsRead(true);
//     }
//     if (notification.ensembleId && notification.type !== "INVITATION") {
//       navigate(`/ensembles/${notification.ensembleId}`);
//     }
//     if (onActionComplete) onActionComplete();
//   };

//   const isRattachementNotification =
//     notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

//   return (
//     <div
//       className={`notification-item ${!isRead ? "notification-unread" : "notification-read"}`}
//       onClick={!isRattachementNotification ? handleClick : undefined}
//       style={{ cursor: isRattachementNotification ? "default" : "pointer" }}
//     >
//       <div className="notification-icon" style={{ color }}>
//         {icon}
//       </div>

//       <div className="notification-content">
//         <p className="notification-message">{notification.message}</p>
//         <span className="notification-date">
//           {new Date(notification.createdAt).toLocaleString()}
//         </span>

//         {/* Boutons Accepter / Refuser pour les notifications de rattachement */}
//       {isRattachementNotification && (
//   <div className="rattachement-actions-container">
//     <button
//       className="action-btn accept-btn"
//       onClick={(e) => {
//         e.stopPropagation();
//         handleAction("accept");
//       }}
//     >
//       <FaCheckCircle size={14} /> Accepter
//     </button>
//     <button
//       className="action-btn reject-btn"
//       onClick={(e) => {
//         e.stopPropagation();
//         handleAction("reject");
//       }}
//     >
//       <FaTimesCircle size={14} /> Refuser
//     </button>
//   </div>
// )}

//         {/* Case à cocher pour marquer comme lu */}
//         <div className="notification-read-toggle">
//           <label>
//             <input
//               type="checkbox"
//               checked={isRead}
//               onChange={async (e) => {
//                 const newIsRead = e.target.checked;
//                 await markAsRead(notification.id, newIsRead);
//                 setIsRead(newIsRead);
//               }}
//             />
//             Lu
//           </label>
//         </div>
//       </div>
//     </div>
//   );
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
    case "RATTACHEMENT":
    case "DEMANDE_RATTACHEMENT":
      return { icon: <FaUserPlus />, color: "#ff9900" };
    case "INSTRUMENT_AJOUTE":
      return { icon: <FaMusic />, color: "#17a2b8" };
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
  const [status, setStatus] = useState(notification.status); // EN_ATTENTE, ACCEPTEE, REFUSEE
  const [hasActioned, setHasActioned] = useState(status !== "EN_ATTENTE");

  // Mettre à jour la notification locale après action
  const handleAction = async (action: "accept" | "reject") => {
    if (!notification.ensembleId) return;

    try {
      await handleRattachementAction(notification.id, notification.ensembleId, action);

      // Mettre à jour l'état local
      setStatus(action === "accept" ? "ACCEPTEE" : "REFUSEE");
      setHasActioned(true);
      setIsRead(true);

      if (onActionComplete) onActionComplete();
    } catch (error) {
      toast.error("Impossible de réaliser l'action. Réessayez.");
    }
  };

  const handleClick = async () => {
    if (!isRead) {
      await markAsRead(notification.id, true);
      setIsRead(true);
    }

    if (notification.ensembleId && notification.type !== "INVITATION") {
      navigate(`/ensembles/${notification.ensembleId}`);
    }

    if (onActionComplete) onActionComplete();
  };

  const isRattachementNotification =
    notification.type === "RATTACHEMENT" || notification.type === "DEMANDE_RATTACHEMENT";

  // Déterminer le texte à afficher selon le status
  const renderMessage = () => {
    if (isRattachementNotification) {
      if (status === "ACCEPTEE") return "Vous êtes rattaché à cet ensemble ✅";
      if (status === "REFUSEE") return "Vous avez refusé la demande ❌";
    }
    return notification.message;
  };

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
        <p className="notification-message">{renderMessage()}</p>
        <span className="notification-date">
          {new Date(notification.createdAt).toLocaleString()}
        </span>

        {/* Boutons Accepter / Refuser seulement si EN_ATTENTE */}
        {isRattachementNotification && !hasActioned && (
          <div className="rattachement-actions-container">
            <button
              className="action-btn accept-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAction("accept");
              }}
            >
              <FaCheckCircle size={14} /> Accepter
            </button>
            <button
              className="action-btn reject-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAction("reject");
              }}
            >
              <FaTimesCircle size={14} /> Refuser
            </button>
          </div>
        )}

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