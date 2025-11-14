import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const InvitationAcceptPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Lien d’invitation invalide.");
      return;
    }

    const acceptInvitation = async () => {
      try {
        const res = await axios.post(`http://localhost:8080/api/invitations/accept?token=${token}`);
        const ensembleId = res.data.ensemble?.id || res.data.ensembleId;

        toast.success("Vous avez rejoint l’ensemble !");
        navigate(`/ensembles/${ensembleId}/members`); //  redirige vers la page MembersList
      } catch (error: any) {
        const message = error.response?.data?.error || error.message;
        if (message === "USER_NOT_FOUND") {
          toast.info("Créez un compte pour rejoindre l’ensemble.");
          navigate(`/register?token=${token}`);
        } else {
          toast.error("Erreur : " + message);
        }
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return (
    <div className="auth-main">
      <h2>Validation de l’invitation...</h2>
      <p>Veuillez patienter pendant que nous vérifions votre lien.</p>
    </div>
  );
};
