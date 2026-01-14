import { useEffect, useState } from "react";
import "../styles/AuthForms.css";
import registrationBanner from "../assets/registration-banner.jpg";
import { registerUser } from "../api/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { rattacherUtilisateurApresInscription } from "../api/invitationApi";

export const Inscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // récupère le token depuis l'URL

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setMotDePasse("");
    setConfirmation("");
  };

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/api/invitations/token/${token}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 410) {
            throw new Error("Le lien d'invitation a expiré.");
          } else if (res.status === 404) {
            throw new Error("Lien d'invitation invalide.");
          } else {
            throw new Error("Erreur lors de la récupération de l'invitation.");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.emailInvite) setEmail(data.emailInvite); // <-- pré-remplissage
      })
      .catch((err) => {
        console.error("Erreur récupération email :", err);
        toast.error(err.message); // message clair
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (motDePasse !== confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      const data = {
        nom,
        prenom,
        email,
        motDePasse,
        token: token || undefined, // on envoie le token au backend
      };

      const utilisateur = await registerUser(data);
      console.log("Utilisateur créé :", utilisateur);

      toast.success("Inscription réussie !");
      resetForm();

      // → rattachement si token présent
      if (token && utilisateur?.id) {
        try {
          await fetch(
            `http://localhost:8080/api/invitations/rattacher-apres-inscription?token=${token}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // si tu utilises JWT
              },
              body: JSON.stringify({
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
              }),
            }
          );
          console.log("Utilisateur rattaché à l'invitation !");
        } catch (err: any) {
          console.error("Erreur rattachement :", err.message);
          toast.error(`Erreur rattachement à l'invitation : ${err.message}`);
        }
      }

      setTimeout(() => {
        const ensembleId =
          (utilisateur as any).ensemble?.id || (utilisateur as any).ensembleId;

        if (ensembleId) {
          navigate(`/ensembles/${ensembleId}/invitations`);
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err: any) {
      console.error(err);
      toast.error(`Erreur lors de l'inscription : ${err.message}`); // backend renvoie ici si token invalide
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <main>
        <section className="form-section">
          <h1 className="form-title">Inscription</h1>
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nom"
                className="form-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Prénom"
                className="form-input"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="form-input"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmation mot de passe"
                className="form-input"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />
              <button
                type="submit"
                className="validate-button"
                disabled={loading}
              >
                {loading ? "Inscription..." : "Valider"}
              </button>
            </form>
          </div>
        </section>

        <section
          className="banner-section"
          style={{ backgroundImage: `url(${registrationBanner})` }}
        >
          <div className="banner-overlay">
            <p>
              "Simplifiez le partage, l'écoute et l'organisation de vos
              partitions et fichiers audios"
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
