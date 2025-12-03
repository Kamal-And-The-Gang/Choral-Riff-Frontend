import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaUserCircle,
  FaCrown,
  FaUser,
  FaEnvelope,
  FaChevronLeft,
  FaUserTie,
} from "react-icons/fa";

// Importez les styles nécessaires pour MembersList
import "../styles/MembersList.css";

// --- DTOs (Types) ---

type Member = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "moderator" | "member";
  profilePic?: string;
};

// --- DONNÉES FICTIVES ---

const mockEnsemble = {
  id: 1,
  name: "Les enfants de Dr Dre",
};

const mockMembers: Member[] = [
  {
    id: 101,
    name: "Michelle Leeb (Moi)",
    email: "michelle@example.com",
    role: "admin",
  },
  {
    id: 102,
    name: "Snoop Dogg",
    email: "snoop@example.com",
    role: "moderator",
  },
  { id: 103, name: "Dr. Dre", email: "dre@example.com", role: "member" },
];


// --- COMPOSANT Membre ---

const MemberItem: React.FC<{ member: Member; isAdmin: boolean }> = ({
  member,
  isAdmin,
}) => {
  // Logique pour l'icône de rôle
  const RoleIcon =
    member.role === "admin" ? FaCrown : member.role === "moderator" ? FaUserTie : FaUser;

  const handleRoleChange = () => {
    // Logique de changement de rôle
    alert(`Changer le rôle de ${member.name} en...`);
  };

  const handleRemoveMember = () => {
    // Logique de retrait de membre
    alert(`Retirer ${member.name} de l'ensemble ?`);
  };

  return (
    <div className="member-item">
      <div className="member-info-main">
        <FaUserCircle size={30} className="member-profile-icon" />
        <div className="member-details-text">
          <span className="member-name">{member.name}</span>
          <span className="member-email">{member.email}</span>
        </div>
      </div>

      <div className="member-actions">
        {/* BADGE DE RÔLE  */}
        <span className={`member-role-tag ${member.role}`}>
          <RoleIcon size={14} className="role-icon" />
          {member.role}
        </span>

        <div className="action-separator"></div>

        <div className="button-group">
          {/* Les actions sont visibles uniquement pour l'Admin et si ce n'est pas lui-même */}
          {isAdmin && member.role !== "admin" && (
            <button
              className="action-button role-button"
              onClick={handleRoleChange}
              title="Promouvoir/Rétrograder le membre"
            >
              {member.role === "moderator" ? "Rétrograder" : "Promouvoir"}
            </button>
          )}
          {isAdmin && member.role !== "admin" && (
            <button
              className="action-button remove-button"
              onClick={handleRemoveMember}
              title="Retirer le membre de l'ensemble"
            >
              Retirer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL (Liste des Membres) ---

export const MembersList: React.FC = () => {
  const { ensembleId: routeEnsembleId } = useParams<{ ensembleId: string }>();
  const ensembleId = Number(routeEnsembleId) || mockEnsemble.id;

  // Simuler la vérification si l'utilisateur est admin
  const userIsAdmin = true;

  return (
    <div className="members-list-container">
      {/* HEADER */}
      <section className="members-header-section detail-header">
        <div className="fiche-title-box">
          <h1 className="fiche-title">Gestion de l'équipe de {mockEnsemble.name}</h1>
        </div>
      </section>

      <main className="details-main">
        <div className="details-content-card members-card">
          {/* Bouton de retour */}
          <Link to={`/ensembles/${ensembleId}`} className="back-link">
            <FaChevronLeft size={12} /> Retour à la Fiche Ensemble
          </Link>

          {/* Bouton Inviter un nouveau membre */}
          <div className="invite-member-section">
            <button
              className="invite-button-lg"
              onClick={() =>
                alert(
                  `Ouvrir la modal d'invitation pour l'ensemble ID: ${ensembleId}`
                )
              }
            >
              <FaEnvelope size={18} /> Inviter un membre
            </button>
          </div>
          {/* SECTION MEMBRES ACTUELS */}
          <h3 className="section-title">
            Membres Actuels ({mockMembers.length} membres)
          </h3>



          {/* Liste des membres */}
          <div className="members-list">
            {mockMembers.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                isAdmin={userIsAdmin}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};