import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AuthForms.css";
import bannerImage from "../assets/registration-banner.jpg";
import { loginUser } from "../api/authApi";

export const Connexion = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    const data = { email, password };
      const tokens = await loginUser(data); // Appel API backend
      login(tokens.accessToken); // On stocke le token via le contexte
      toast.success("Connexion réussie !");
      navigate("/"); // Redirection page d'accueil
    } catch (err: any) {
      console.error("Erreur lors de la connexion :", err);
      toast.error("Email ou mot de passe incorrect ❌");
    }
  };

  return (
    <div className="inscription-container">
      <main className="form-section">
        <h1 className="form-title">Connexion</h1>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Votre adresse email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              placeholder="Votre mot de passe"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="forgot-password-link">
              <Link to="/mot-de-passe-oublie" className="forgot-password-text">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className="validate-button submit-button">
              Se connecter
            </button>
          </form>

          <p className="link-to-register">
            Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
          </p>
        </div>
      </main>

      <section
        className="banner-section"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-overlay">
          <p>
            "Simplifiez le partage, l'écoute et l'organisation de vos partitions
            et fichiers audios"
          </p>
        </div>
      </section>
    </div>
  );
};
