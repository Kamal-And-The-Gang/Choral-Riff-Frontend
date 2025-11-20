import { useParams } from "react-router-dom";
import "../styles/HomePage.css";
import React, { useEffect, useState } from "react";
import "../styles/Invitation.css";
import { getInvitationsWithRoles } from "../api/invitationApi";

export const Invitation: React.FC = () => {
  const { ensembleId } = useParams<{ ensembleId: string }>();
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getInvitationsWithRoles(Number(ensembleId));
        setInvitations(data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchInvitations();
  }, [ensembleId]);

  return (
    <div>
      <h1>Gestion d'ensemble</h1>

      <div className="container">
        {/* 🔹 Champ de recherche en haut */}
        <input type="text" id="search" placeholder="Recherche" />
        <button type="button">Filtrer</button>
        <button type="button">Ajouter</button>

        <h2>Invitations envoyées :</h2>

        <div className="table-wrapper"></div>
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
                <td>{inv.nomInvite || "-"}</td>
                <td>{inv.emailInvite}</td>
                <td>{inv.etat || "En attente"}</td>

                <td>
                  <input
                    type="text"
                    placeholder="Rôle"
                    className="table-input"
                    value={inv.role || ""} // role vient du fetch
                    readOnly
                  />
                </td>

                <td>
                  <input
                    type="text"
                    placeholder="Écrire un message"
                    className="table-input"
                    value={inv.message || ""}
                    onChange={(e) => {
                      const newInvitations = [...invitations];
                      const index = newInvitations.findIndex(
                        (i) => i.id === inv.id
                      );
                      newInvitations[index].message = e.target.value;
                      setInvitations(newInvitations);
                    }}
                  />
                </td>
                <td>
                  <button
                    className="validate-button"
                    onClick={() => {
                      //  logique pour envoyer le message réel
                      alert(
                        `Message envoyé à ${inv.emailInvite}: "${inv.message}"`
                      );
                    }}
                  >
                    Envoyer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </div> */}
      </div>
    </div>
  );
};
