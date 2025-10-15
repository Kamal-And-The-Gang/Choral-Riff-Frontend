import { useState } from 'react';
import '../styles/AuthForms.css';
import registrationBanner from '../assets/registration-banner.jpg'; // Mettez votre image de bannière ici
import { registerUser } from '../api/authApi';

export const Inscription = () => {

   const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // --- Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (motDePasse !== confirmation) {
      setMessage("⚠️ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const data = {
        nom,
        prenom,
        email,
        motDePasse,
      };

      const utilisateur = await registerUser(data);
      console.log("Utilisateur créé :", utilisateur);
      setMessage("✅ Inscription réussie !");
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Erreur lors de l'inscription : ${err.message}`);
    }
  };

  return (
    <div className="home-container">
      <main>
        {/* --- Formulaire --- */}
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

              <button type="submit" className="validate-button">
                Valider
              </button>
            </form>

            {/* Message d'état */}
            {message && <p className="form-message">{message}</p>}
          </div>
        </section>

        {/* --- Bannière à droite --- */}
        <section
          className="banner-section"
          style={{ backgroundImage: `url(${registrationBanner})` }}
        >
          <div className="banner-overlay">
            <p>
              "Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};