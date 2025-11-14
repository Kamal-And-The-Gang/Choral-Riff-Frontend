
import { useEffect, useState } from "react";
import "../styles/AuthForms.css";
import registrationBanner from "../assets/registration-banner.jpg";
import { registerUser } from "../api/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export const Inscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // <-- récupère le token depuis l'URL

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
    resetForm();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (motDePasse !== confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      // Inclut le token si présent
      const data = { 
        nom, 
        prenom, 
        email, 
        motDePasse, 
        token: token || undefined // <-- ici on envoie le token au back
      };

      const utilisateur = await registerUser(data);
      console.log("Utilisateur créé :", utilisateur);

      toast.success("Inscription réussie !");
      resetForm();

 // Redirection douce après 1.5 secondes
setTimeout(() => {
  // On tente de récupérer l'ensembleId de plusieurs façons
  const ensembleId =
    (utilisateur as any).ensemble?.id || // si backend renvoie un objet ensemble
    (utilisateur as any).ensembleId;     // si backend renvoie juste l'id

  if (ensembleId) {
    navigate(`/ensembles/${ensembleId}/members`);
  } else {
    navigate("/"); // fallback
  }
}, 1500);


    } catch (err: any) {
      console.error(err);
      toast.error(`Erreur lors de l'inscription : ${err.message}`);
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
