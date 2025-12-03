import { useParams } from "react-router-dom";
import "../styles/HomePage.css";
import React, { useEffect, useState } from "react";
import "../styles/Invitation.css";
import { getInvitationsWithRoles } from "../api/invitationApi";

export const Invitation: React.FC = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      prev.map((inv) => (inv.id === id ? { ...inv, message } : inv))
    );
  };

  const sendMessage = (inv: any) => {
    alert(`Message envoyé à ${inv.emailInvite}: "${inv.message}"`);
  };
  const resendEmail = async (invId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/invitations/resend/${invId}`,
        {
          method: "POST",
        }
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

  return (
    <div className="invitation-container">
      <h1>Gestion d'ensemble</h1>

      <div className="container">
        <input type="text" id="search" placeholder="Recherche" />
        <button type="button">Filtrer</button>
        <button type="button" onClick={fetchInvitations}>
          Actualiser
        </button>

        <h2>Invitations envoyées :</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="table-wrapper">
            <table className="invitation-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Rôle</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id}>
                    <td data-label="Nom">
                      <div className="cell-content">
                        {inv.utilisateurNom || "-"}
                      </div>
                    </td>
                    <td data-label="Email">
                      <div className="cell-content">{inv.emailInvite}</div>
                    </td>
                    <td data-label="Statut">
                      <div className="cell-content">
                        {inv.etat || "En attente"}
                      </div>
                    </td>
                    <td data-label="Rôle">
                      <div className="cell-content">
                        <input
                          type="text"
                          placeholder="Rôle"
                          className="table-input"
                          value={inv.role || ""}
                          readOnly
                        />
                      </div>
                    </td>
                    <td data-label="Message">
                      <div className="cell-content">
                        <input
                          type="text"
                          placeholder="Écrire un message"
                          className="table-input"
                          value={inv.message || ""}
                          onChange={(e) =>
                            updateMessage(inv.id, e.target.value)
                          }
                        />
                      </div>
                    </td>
                    {/* <td data-label="Action">
        <div className="cell-content">
          <button
            className="validate-button"
            onClick={() => sendMessage(inv)}
          >
            Envoyer
          </button>
        </div>



      </td> */}

                    <td data-label="Action">
                      <div className="cell-content">
                        {/* <button
      className="validate-button"
      onClick={() => sendMessage(inv)}
    >
      Envoyer
    </button> */}

                        <button
                          className="resend-button"
                          onClick={() => resendEmail(inv.id)}
                          style={{ marginLeft: "8px" }}
                        >
                          Renvoyer email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
