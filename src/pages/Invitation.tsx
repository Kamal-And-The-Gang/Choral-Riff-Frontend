import { useParams } from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/Invitation.css";
import React, { useEffect, useState } from "react";
import { getInvitationsWithRoles } from "../api/invitationApi";

interface Invitation {
  id: number;
  utilisateurNom?: string;
  emailInvite: string;
  etat?: string;
  role?: string | null;
  message?: string;
  photoUrl?: string;
  instrument?: string;
}
interface InvitationCardProps {
  invitation: Invitation;
  onMessageChange: (id: number, message: string) => void;
  onResend: (id: number) => void;
}

export const Invitation: React.FC = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // pour stocker le texte saisi

  const fetchInvitations = async () => {
    if (!ensembleId) return;
    setLoading(true);
    try {
      const data = await getInvitationsWithRoles(Number(ensembleId));
      setInvitations(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [ensembleId]);

  const updateMessage = (id: number, message: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, message } : inv)),
    );
  };

  const resendEmail = async (invId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/invitations/resend/${invId}`,
        { method: "POST" },
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert("Erreur : " + errorData.error);
        return;
      }
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'email");
    }
  };

  // ---- Étape filtrage ----
  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.utilisateurNom?.toLowerCase().includes(searchText.toLowerCase()) ||
      inv.emailInvite.toLowerCase().includes(searchText.toLowerCase()) ||
      (inv.role?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (inv.instrument?.toLowerCase().includes(searchText.toLowerCase()) ??
        false),
  );

  // ---------------------------------------------------
  // Composant interne InvitationCard réutilisable
  const InvitationCard: React.FC<InvitationCardProps> = ({
    invitation,
    onMessageChange,
    onResend,
  }) => {
    return (
      <div className="invitation-card">
        <h3>{invitation.utilisateurNom || "-"}</h3>

        {invitation.photoUrl && (
          <img
            src={invitation.photoUrl}
            alt={invitation.utilisateurNom}
            className="card-photo"
          />
        )}

        {invitation.instrument && (
          <p>
            <strong>Instrument :</strong> {invitation.instrument}
          </p>
        )}

        <p>
          <strong>Email :</strong> {invitation.emailInvite}
        </p>
        <p>
          <strong>Statut :</strong> {invitation.etat || "En attente"}
        </p>

        <p>
          <strong>Rôle :</strong> {invitation.role || ""}
        </p>

        <p>
          <strong>Message :</strong> <br></br>
          <br></br>
          <input
            type="text"
            placeholder="Écrire un message"
            value={invitation.message || ""}
            onChange={(e) => onMessageChange(invitation.id, e.target.value)}
            className="card-input"
          />
        </p>

        <div className="card-actions">
          {invitation.etat?.toUpperCase() !== "ACCEPTEE" && (
            <button
              className="resend-button"
              onClick={() => onResend(invitation.id)}
              title="Renvoyer l'email"
            >
              Renvoyer email
            </button>
          )}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------

  return (
    <div className="invitation-container">
      <h1>Gestion d'ensemble</h1>

      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Recherche"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button type="button" onClick={fetchInvitations}>
            Actualiser
          </button>
        </div>

        <h2>Invitations envoyées :</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="card-grid">
            {filteredInvitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                onMessageChange={updateMessage}
                onResend={resendEmail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
