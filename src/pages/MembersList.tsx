// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   FaUserCircle,
//   FaCrown,
//   FaUser,
//   FaEnvelope,
//   FaChevronLeft,
//   FaUserTie,
// } from "react-icons/fa";

// // Importez les styles nécessaires pour MembersList
// import "../styles/MembersList.css";

// // --- DTOs (Types) ---

// type Member = {
//   id: number;
//   name: string;
//   email: string;
//   role: "OWNER" | "moderator" | "member";
//   profilePic?: string;
// };

// // --- DONNÉES FICTIVES ---

// const mockEnsemble = {
//   id: 1,
//   name: "Les enfants de Dr Dre",
// };

// const mockMembers: Member[] = [
//   {
//     id: 101,
//     name: "Michelle Leeb (Moi)",
//     email: "michelle@example.com",
//     role: "OWNER",
//   },
//   {
//     id: 102,
//     name: "Snoop Dogg",
//     email: "snoop@example.com",
//     role: "moderator",
//   },
//   { id: 103, name: "Dr. Dre", email: "dre@example.com", role: "member" },
// ];

// // --- COMPOSANT Membre ---

// const MemberItem: React.FC<{ member: Member; isOWNER: boolean }> = ({
//   member,
//   isOWNER,
// }) => {
//   // Logique pour l'icône de rôle
//   const RoleIcon =
//     member.role === "OWNER"
//       ? FaCrown
//       : member.role === "moderator"
//         ? FaUserTie
//         : FaUser;

//   const handleRoleChange = () => {
//     // Logique de changement de rôle
//     alert(`Changer le rôle de ${member.name} en...`);
//   };

//   const handleRemoveMember = () => {
//     // Logique de retrait de membre
//     alert(`Retirer ${member.name} de l'ensemble ?`);
//   };

//   return (
//     <div className="member-item">
//       <div className="member-info-main">
//         <FaUserCircle size={30} className="member-profile-icon" />
//         <div className="member-details-text">
//           <span className="member-name">{member.name}</span>
//           <span className="member-email">{member.email}</span>
//         </div>
//       </div>

//       <div className="member-actions">
//         {/* BADGE DE RÔLE  */}
//         <span className={`member-role-tag ${member.role}`}>
//           <RoleIcon size={14} className="role-icon" />
//           {member.role}
//         </span>

//         <div className="action-separator"></div>

//         <div className="button-group">
//           {/* Les actions sont visibles uniquement pour l'OWNER et si ce n'est pas lui-même */}
//           {isOWNER && member.role !== "OWNER" && (
//             <button
//               className="action-button role-button"
//               onClick={handleRoleChange}
//               title="Promouvoir/Rétrograder le membre"
//             >
//               {member.role === "moderator" ? "Rétrograder" : "Promouvoir"}
//             </button>
//           )}
//           {isOWNER && member.role !== "OWNER" && (
//             <button
//               className="action-button remove-button"
//               onClick={handleRemoveMember}
//               title="Retirer le membre de l'ensemble"
//             >
//               Retirer
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPOSANT PRINCIPAL (Liste des Membres) ---

// export const MembersList: React.FC = () => {
//   const { ensembleId: routeEnsembleId } = useParams<{ ensembleId: string }>();
//   const ensembleId = Number(routeEnsembleId) || mockEnsemble.id;

//   // Simuler la vérification si l'utilisateur est OWNER
//   const userIsOWNER = true;

//   return (
//     <div className="members-list-container">
//       {/* HEADER */}
//       <section className="members-header-section detail-header">
//         <div className="fiche-title-box">
//           <h1 className="fiche-title">
//             Gestion de l'équipe de {mockEnsemble.name}
//           </h1>
//         </div>
//       </section>

//       <main className="details-main">
//         <div className="details-content-card members-card">
//           {/* Bouton de retour */}
//           <Link to={`/ensembles/${ensembleId}`} className="back-link">
//             <FaChevronLeft size={12} /> Retour à la Fiche Ensemble
//           </Link>

//           {/* Bouton Inviter un nouveau membre */}
//           <div className="invite-member-section">
//             <button
//               className="invite-button-lg"
//               onClick={() =>
//                 alert(
//                   `Ouvrir la modal d'invitation pour l'ensemble ID: ${ensembleId}`,
//                 )
//               }
//             >
//               <FaEnvelope size={18} /> Inviter un membre
//             </button>
//           </div>
//           {/* SECTION MEMBRES ACTUELS */}
//           <h3 className="section-title">
//             Membres Actuels ({mockMembers.length} membres)
//           </h3>

//           {/* Liste des membres */}
//           <div className="members-list">
//             {mockMembers.map((member) => (
//               <MemberItem
//                 key={member.id}
//                 member={member}
//                 isOWNER={userIsOWNER}
//               />
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaUserCircle,
  FaCrown,
  FaUser,
  FaEnvelope,
  FaChevronLeft,
  FaUserTie,
  FaUserMinus,
} from "react-icons/fa";

import "../styles/MembersList.css";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  creerInvitation,
  type InvitationDTO,
} from "../api/invitationApi";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// ======================================================
// DEMANDER LE RATTACHEMENT
// ======================================================

const demanderRattachement = async (
  utilisateurId: number,
  ensembleId: number
) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/invitations/demanderRattachement`,
      null,
      {
        params: {
          utilisateurId,
          ensembleId,
        },
      }
    );

    toast.success(res.data.message);
  } catch (err: any) {
    toast.error(
      err.response?.data?.error ||
        "Erreur lors de la demande"
    );
  }
};

// ======================================================
// TYPES
// ======================================================

type Role = "OWNER" | "MODERATEUR" | "MEMBRE";

type Member = {
  utilisateurId: number;
  nom: string;
  prenom: string;
  role: Role;
  creator: boolean;
};

type Ensemble = {
  id: number;
  nom: string;
};

// ======================================================
// PROPS MEMBER ITEM
// ======================================================

type MemberItemProps = {
  member: Member;
  isOWNER: boolean;

  onRoleChange: (
    cibleId: number,
    nouveauRole: "MEMBRE" | "MODERATEUR"
  ) => void;

  onRemoveMember: (member: Member) => void;

  actionLoading: boolean;
};

// ======================================================
// CARD MEMBRE
// ======================================================

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  isOWNER,
  onRoleChange,
  onRemoveMember,
  actionLoading,
}) => {
  const RoleIcon =
    member.role === "OWNER"
      ? FaCrown
      : member.role === "MODERATEUR"
        ? FaUserTie
        : FaUser;

  const nomComplet = `${member.prenom} ${member.nom}`;

  return (
    <div className="member-item">

      {/* ================================================
          INFORMATIONS DU MEMBRE
          ================================================ */}

      <div className="member-info-main">

        <FaUserCircle
          size={45}
          className="member-profile-icon"
        />

        <div className="member-details-text">

          <span className="member-name">
            {nomComplet}
          </span>

          <span className="member-email">
            ID utilisateur : {member.utilisateurId}
          </span>

        </div>
      </div>

      {/* ================================================
          ROLE + ACTIONS
          ================================================ */}

      <div className="member-actions">

        {/* BADGE ROLE */}

        <span
          className={`member-role-tag ${member.role}`}
          title={
            member.role === "OWNER"
              ? "Propriétaire de l'ensemble"
              : member.role === "MODERATEUR"
                ? "Membre disposant de droits supplémentaires"
                : "Membre classique"
          }
        >
          <RoleIcon
            size={14}
            className="role-icon"
          />

          {member.role === "OWNER"
            ? "OWNER"
            : member.role === "MODERATEUR"
              ? "MODÉRATEUR"
              : "MEMBRE"}
        </span>

        {/* ================================================
            ACTIONS UNIQUEMENT POUR L'OWNER
            ================================================ */}

        {isOWNER && member.role !== "OWNER" && (

          <div className="button-group">

            {/* --------------------------------------------
                MEMBRE -> MODERATEUR
                -------------------------------------------- */}

            {member.role === "MEMBRE" && (
              <button
                type="button"
                className="action-button role-button"
                disabled={actionLoading}
                onClick={() =>
                  onRoleChange(
                    member.utilisateurId,
                    "MODERATEUR"
                  )
                }
                title="Donner à ce membre des droits supplémentaires de gestion"
              >
                <FaUserTie size={13} />
                Promouvoir en modérateur
              </button>
            )}

            {/* --------------------------------------------
                MODERATEUR -> MEMBRE
                -------------------------------------------- */}

            {member.role === "MODERATEUR" && (
              <button
                type="button"
                className="action-button role-button"
                disabled={actionLoading}
                onClick={() =>
                  onRoleChange(
                    member.utilisateurId,
                    "MEMBRE"
                  )
                }
                title="Retirer les droits de modérateur et conserver le membre dans l'ensemble"
              >
                <FaUser size={13} />
                Rétrograder en membre
              </button>
            )}

            {/* --------------------------------------------
                RETIRER DE L'ENSEMBLE
                -------------------------------------------- */}

            <button
              type="button"
              className="action-button remove-button"
              disabled={actionLoading}
              onClick={() => onRemoveMember(member)}
              title="Retirer cette personne de cet ensemble. Son compte utilisateur sera conservé."
            >
              <FaUserMinus size={13} />
              Retirer de l'ensemble
            </button>

          </div>
        )}

        {/* ================================================
            MESSAGE POUR LE OWNER
            ================================================ */}

        {member.role === "OWNER" && (
          <span
            className="owner-label"
            title="Le propriétaire ne peut pas être retiré de l'ensemble"
          >
            Propriétaire
          </span>
        )}

      </div>
    </div>
  );
};

// ======================================================
// PAGE PRINCIPALE
// ======================================================

export const MembersList: React.FC = () => {
  const { ensembleId: routeEnsembleId } =
    useParams<{ ensembleId: string }>();

  const { user } = useAuth();

  const ensembleId = Number(routeEnsembleId);

  // ====================================================
  // ETATS
  // ====================================================

  const [members, setMembers] = useState<Member[]>([]);

  const [ensemble, setEnsemble] =
    useState<Ensemble | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  // ====================================================
  // ETATS INVITATION
  // ====================================================

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [showInvitationModal, setShowInvitationModal] =
    useState(false);

  const [invitationResponse, setInvitationResponse] =
    useState<InvitationDTO | null>(null);

  // ====================================================
  // DEMANDER RATTACHEMENT
  // ====================================================

  const handleDemanderRattachement = async () => {
    if (!user?.id) {
      toast.error(
        "Utilisateur connecté introuvable."
      );
      return;
    }

    if (!ensembleId || Number.isNaN(ensembleId)) {
      toast.error(
        "Identifiant de l'ensemble invalide."
      );
      return;
    }

    if (!email.trim()) {
      toast.error(
        "Veuillez saisir l'identifiant de l'utilisateur."
      );
      return;
    }

    const utilisateurId = Number(email);

    if (Number.isNaN(utilisateurId)) {
      toast.error(
        "L'identifiant utilisateur doit être un nombre."
      );
      return;
    }

    await demanderRattachement(
      utilisateurId,
      ensembleId
    );

    setEmail("");
    setName("");
    setShowInvitationModal(false);
  };

  // ====================================================
  // RECUPERER LES MEMBRES
  // ====================================================

  const fetchMembers = async () => {
    if (!ensembleId || Number.isNaN(ensembleId)) {
      setError(
        "Identifiant de l'ensemble invalide."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/utilisateur-ensembles/ensemble/${ensembleId}/membres`
      );

      if (!response.ok) {
        throw new Error(
          `Erreur serveur : ${response.status}`
        );
      }

      const data: Member[] =
        await response.json();

      setMembers(data);

    } catch (err) {
      console.error(
        "Erreur lors du chargement des membres :",
        err
      );

      setError(
        "Impossible de charger les membres de l'ensemble."
      );

    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // RECUPERER L'ENSEMBLE
  // ====================================================

  const fetchEnsemble = async () => {
    if (!ensembleId || Number.isNaN(ensembleId)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/ensembles/${ensembleId}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setEnsemble({
        id: data.id,
        nom: data.nom,
      });

    } catch (err) {
      console.warn(
        "Impossible de récupérer l'ensemble.",
        err
      );
    }
  };

  // ====================================================
  // CHARGEMENT INITIAL
  // ====================================================

  useEffect(() => {
    fetchMembers();
    fetchEnsemble();
  }, [ensembleId]);

  // ====================================================
  // UTILISATEUR CONNECTE
  // ====================================================

  const currentMember = members.find(
    (member) =>
      member.utilisateurId === user?.id
  );

  const userIsOWNER =
    currentMember?.role === "OWNER";

  // ====================================================
  // CHANGER LE ROLE
  // ====================================================

  const handleRoleChange = async (
    cibleId: number,
    nouveauRole: "MEMBRE" | "MODERATEUR"
  ) => {
    if (!user?.id) {
      alert(
        "Utilisateur connecté introuvable."
      );
      return;
    }

    if (!ensembleId || Number.isNaN(ensembleId)) {
      alert(
        "Identifiant de l'ensemble invalide."
      );
      return;
    }

    try {
      setActionLoading(true);

      const params = new URLSearchParams({
        acteurId: String(user.id),
        cibleId: String(cibleId),
        ensembleId: String(ensembleId),
        nouveauRole,
      });

      const response = await fetch(
        `${API_BASE_URL}/utilisateur-ensembles/role?${params.toString()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        // Réponse sans JSON
      }

      if (response.status === 403) {
        alert(
          data.message ||
            "Vous n'avez pas le droit de modifier ce rôle."
        );
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Erreur lors de la modification du rôle."
        );
        return;
      }

      alert(
        data.message ||
          "Rôle modifié avec succès."
      );

      await fetchMembers();

    } catch (err) {
      console.error(
        "Erreur lors du changement de rôle :",
        err
      );

      alert(
        "Impossible de modifier le rôle."
      );

    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // RETIRER UN MEMBRE DE L'ENSEMBLE
  // ====================================================

  const handleRemoveMember = async (
    member: Member
  ) => {
    if (!user?.id) {
      alert(
        "Utilisateur connecté introuvable."
      );
      return;
    }

    const nomComplet =
      `${member.prenom} ${member.nom}`;

    const confirmation = window.confirm(
      `Retirer ${nomComplet} de cet ensemble ?\n\n` +
      `Son compte utilisateur ne sera PAS supprimé.`
    );

    if (!confirmation) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/utilisateur-ensembles/ensemble/${ensembleId}/membre/${member.utilisateurId}?acteurId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        // Réponse sans JSON
      }

      if (response.status === 403) {
        alert(
          data.message ||
            "Vous n'avez pas le droit de retirer ce membre."
        );
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Impossible de retirer ce membre de l'ensemble."
        );
        return;
      }

      alert(
        data.message ||
          `${nomComplet} a été retiré de l'ensemble.`
      );

      await fetchMembers();

    } catch (err) {
      console.error(
        "Erreur lors du retrait du membre :",
        err
      );

      alert(
        "Impossible de retirer le membre de l'ensemble."
      );

    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // CHARGEMENT
  // ====================================================

  if (loading) {
    return (
      <div className="members-list-container">
        <main className="details-main">
          <div className="details-content-card members-card">
            <p>Chargement des membres...</p>
          </div>
        </main>
      </div>
    );
  }

  // ====================================================
  // ERREUR
  // ====================================================

  if (error) {
    return (
      <div className="members-list-container">
        <main className="details-main">
          <div className="details-content-card members-card">

            <Link
              to={`/ensembles/${ensembleId}`}
              className="back-link"
            >
              <FaChevronLeft size={12} />
              Retour à la Fiche Ensemble
            </Link>

            <p>{error}</p>

          </div>
        </main>
      </div>
    );
  }

  // ====================================================
  // AFFICHAGE
  // ====================================================

  return (
    <div className="members-list-container">

      {/* =================================================
          HEADER
          ================================================= */}

      {/* <section className="members-header-section detail-header">

        <div className="fiche-title-box">

          <h1 className="fiche-title">
            Gestion de l'équipe
            {ensemble?.nom
              ? ` de ${ensemble.nom}`
              : ""}
          </h1>

        </div>

      </section> */}


      {/* =================================================
          CONTENU
          ================================================= */}

      <main className="details-main">

        <div className="details-content-card members-card">

          {/* RETOUR */}

          <Link
            to={`/ensembles/${ensembleId}`}
            className="back-link"
          >
            <FaChevronLeft size={12} />
            Retour à la Fiche Ensemble
          </Link>

          {/* =================================================
              HEADER DE LA CARD
              ================================================= */}

          <div className="members-card-header">

            <div>
              <h2>
                Membres de l'ensemble
              </h2>

              <p>
                Gérez les rôles et les membres
                de cet ensemble.
              </p>
            </div>

            {/* INVITATION */}

            {userIsOWNER && (
              <button
                type="button"
                className="invite-button-lg"
                onClick={() => {
                  setShowInvitationModal(true);
                  setInvitationResponse(null);
                }}
              >
                <FaEnvelope size={18} />
                Inviter un membre
              </button>
            )}

          </div>

          {/* =================================================
              MODAL INVITATION
              ================================================= */}

          {showInvitationModal && (
            <div className="invitation-modal-overlay">

              <div className="invitation-modal">

                <h2>
                  Inviter un membre
                </h2>

                <p>
                  Entrez l'identifiant de l'utilisateur
                  que vous souhaitez rattacher à cet ensemble.
                </p>

                <div className="form-group">

                  <label htmlFor="utilisateurId">
                    ID utilisateur
                  </label>

                  <input
                    id="utilisateurId"
                    type="number"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Ex : 25"
                  />

                </div>

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowInvitationModal(false);
                      setEmail("");
                      setName("");
                    }}
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    className="invite-button-lg"
                    onClick={
                      handleDemanderRattachement
                    }
                  >
                    <FaEnvelope size={16} />
                    Envoyer la demande
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              EXPLICATION DES ROLES
              ================================================= */}

          <div className="roles-card">

            <h3>
              Rôles
            </h3>

            <div className="role-explanation">

              <div className="role-explanation-item">

                <span className="member-role-tag OWNER">
                  <FaCrown size={13} />
                  OWNER
                </span>

                <span>
                  Propriétaire de l'ensemble.
                </span>

              </div>

              <div className="role-explanation-item">

                <span className="member-role-tag MODERATEUR">
                  <FaUserTie size={13} />
                  MODÉRATEUR
                </span>

                <span>
                  Dispose de droits supplémentaires
                  de gestion.
                </span>

              </div>

              <div className="role-explanation-item">

                <span className="member-role-tag MEMBRE">
                  <FaUser size={13} />
                  MEMBRE
                </span>

                <span>
                  Membre classique de l'ensemble.
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              LISTE
              ================================================= */}

          <div className="members-section-header">

            <h3 className="section-title">
              Membres actuels
            </h3>

            <span className="members-count">
              {members.length} membre
              {members.length > 1 ? "s" : ""}
            </span>

          </div>

          {members.length === 0 ? (

            <div className="empty-members-card">

              <FaUserCircle
                size={45}
                className="empty-members-icon"
              />

              <h3>
                Aucun membre
              </h3>

              <p>
                Cet ensemble ne contient
                actuellement aucun membre.
              </p>

            </div>

          ) : (

            <div className="members-list">

              {members.map((member) => (

                <MemberItem
                  key={member.utilisateurId}
                  member={member}
                  isOWNER={userIsOWNER}
                  onRoleChange={handleRoleChange}
                  onRemoveMember={
                    handleRemoveMember
                  }
                  actionLoading={
                    actionLoading
                  }
                />

              ))}

            </div>

          )}

          {/* =================================================
              ACTION EN COURS
              ================================================= */}

          {actionLoading && (
            <div className="action-loading">
              Modification en cours...
            </div>
          )}

        </div>

      </main>

      {/* =================================================
          TOASTS
          ================================================= */}

      <ToastContainer />

    </div>
  );
};

export default MembersList;
