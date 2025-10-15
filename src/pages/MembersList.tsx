import React from "react";
import { useParams } from "react-router-dom";
import {
  FaUserCircle,
  FaCrown,
  FaUser,
  FaEnvelope,
  FaChevronLeft,
  FaUserTie,
} from "react-icons/fa";
import "../styles/MembersList.css";

// --- TYPESCRIPT TYPES ---
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
  { id: 104, name: "Eminem", email: "eminem@example.com", role: "member" },
  {
    id: 105,
    name: "September",
    email: "september@example.com",
    role: "member",
  },
];

// --- COMPOSANT Membre ---

const MemberItem: React.FC<{ member: Member; isAdmin: boolean }> = ({
  member,
  isAdmin,
}) => {
  let RoleIcon: React.ElementType;
  if (member.role === "admin") {
    RoleIcon = FaCrown;
  } else if (member.role === "moderator") {
    RoleIcon = FaUserTie;
  } else {
    RoleIcon = FaUser;
  }

  // Simuler le fait que l'utilisateur connecté est toujours l'admin dans ce scénario

  const handleRoleChange = () => {
    // Logique de changement de rôle
    alert(
      `Changer le rôle de ${member.name} en ${member.role === "admin" ? "membre" : "administrateur"
      } ?`
    );
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
        {/* BADGE DE RÔLE (Laissé tel quel) */}
        <span className={`member-role-tag ${member.role}`}>{member.role}</span>

        {/* NOUVEAU: SÉPARATEUR VISUEL */}
        <div className="action-separator"></div>

        <div className="button-group">
          {isAdmin && member.role !== 'admin' && (
            <button className="action-button role-button" onClick={handleRoleChange}>
              {member.role === 'moderator' ? 'Rétrograder' : 'Promouvoir'}
            </button>
          )}
          {isAdmin && member.role !== 'admin' && (
            <button className="action-button remove-button" onClick={handleRemoveMember}>
              Retirer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export const MembersList = () => {
  // Récupère l'ID de l'ensemble depuis l'URL
  const { ensembleId: routeEnsembleId } = useParams<{ ensembleId: string }>();
  const ensembleId = Number(routeEnsembleId) || mockEnsemble.id;

  // Simuler la vérification si l'utilisateur est admin
  // Pour cet exemple, nous supposons que l'utilisateur qui regarde est toujours l'admin
  const userIsAdmin = true;

  return (
    <div className="members-list-container">
      {/* Bannière simplifiée */}
      <section className="members-header-section detail-header">
        <div className="fiche-title-box">
          <h1 className="fiche-title">Membres de {mockEnsemble.name}</h1>
        </div>
      </section>

      <main className="details-main">
        <div className="details-content-card members-card">
          {/* Bouton de retour */}
          <a href={`/ensembles/${ensembleId}`} className="back-link">
            <FaChevronLeft size={12} /> Retour à la Fiche Ensemble
          </a>

          <h3 className="section-title">
            Gestion de l'équipe ({mockMembers.length} membres)
          </h3>

          {/* Bouton Inviter un nouveau membre */}
          <div className="invite-member-section">
            <button
              className="invite-button-lg"
              onClick={() =>
                alert(
                  `Inviter un nouveau membre pour l'ensemble ID: ${ensembleId}`
                )
              }
            >
              <FaEnvelope size={18} /> Inviter un membre
            </button>
          </div>

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