

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaUserCircle,
  FaCrown,
  FaUser,
  FaChevronLeft,
  FaUserTie,
  FaUserMinus,
} from "react-icons/fa";

import "../styles/MembersList.css";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";

// ======================================================
// FETCH AUTHENTIFIE (ajoute le token JWT)
// ======================================================



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
  photoProfil?: string;
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
      {/* INFORMATIONS DU MEMBRE */}

      <div className="member-info-main">
      <div className="member-avatar">
  {member.photoProfil ? (
    <img
      src={`http://localhost:8080${member.photoProfil}`}
      alt={`Photo de ${member.prenom} ${member.nom}`}
    />
  ) : (
    <>
      {member.prenom.charAt(0).toUpperCase()}
      {member.nom.charAt(0).toUpperCase()}
    </>
  )}
</div>

        <div className="member-details-text">
          <span className="member-name">
            {nomComplet}
          </span>

          <span className="member-email">
            ID utilisateur : {member.utilisateurId}
          </span>
        </div>
      </div>

      {/* ROLE + ACTIONS */}

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

        {/* ACTIONS UNIQUEMENT POUR L'OWNER */}

        {isOWNER && member.role !== "OWNER" && (
          <div className="button-group">
            {/* MEMBRE -> MODERATEUR */}

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

            {/* MODERATEUR -> MEMBRE */}

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

            {/* RETIRER DE L'ENSEMBLE */}

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

        {/* LABEL POUR LE OWNER */}

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

const { user, token } = useAuth();
const authFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

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

      const response = await authFetch(
        `${API_BASE_URL}/utilisateur-ensembles/ensemble/${ensembleId}/membres`
      );

      if (!response.ok) {
        const body = await response.text();
        console.error(
          "Erreur GET membres :",
          response.status,
          body
        );
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
      const response = await authFetch(
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

  // useEffect(() => {
  //   fetchMembers();
  //   fetchEnsemble();
  // }, [ensembleId]);




  useEffect(() => {
  if (!token || !ensembleId) return;

  fetchMembers();
  fetchEnsemble();
}, [ensembleId, token]);

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

      const response = await authFetch(
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

      // URL alignée avec le contrôleur Spring :
      // DELETE /utilisateur-ensembles/membre?acteurId=&cibleId=&ensembleId=
      const params = new URLSearchParams({
        acteurId: String(user.id),
        cibleId: String(member.utilisateurId),
        ensembleId: String(ensembleId),
      });

      const response = await authFetch(
        `${API_BASE_URL}/utilisateur-ensembles/membre?${params.toString()}`,
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

          {/* HEADER DE LA CARD */}

          <div className="members-card-header">
            <div>
              <h2>
                Membres
                {ensemble?.nom
                  ? ` de ${ensemble.nom}`
                  : ""}
              </h2>

              <p>
                Gérez les rôles et les membres
                de cet ensemble.
              </p>
            </div>
          </div>

          {/* LISTE */}

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

          {/* ACTION EN COURS */}

          {actionLoading && (
            <div className="action-loading">
              Modification en cours...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MembersList;
