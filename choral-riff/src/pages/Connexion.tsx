
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/Connexion.css';
import registrationBanner from '../assets/registration-banner.jpg'; // Réutilisation de la bannière


export const Connexion = () => {
  return (
    <div className="home-container">
      {/* 1. Header  */}
      <Header />

      <main>
        {/* 2. Section du formulaire */}
        <section className="form-section">
          <h2>Connexion</h2>
          <div className="form-card">
            <form>
              <input type="email" placeholder="Email" className="form-input" />
              <input type="password" placeholder="Mot de passe" className="form-input" />
              <button type="submit" className="validate-button">Se connecter</button>
            </form>
          </div>
        </section>

        {/*3. Section de la bannière (Identique à la page Inscription) */}
        <section className="banner-section" style={{ backgroundImage: `url(${registrationBanner})` }}>
          <div className="banner-overlay">
            <p>"Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"</p>
          </div>
        </section>
      </main>

      {/* 4. Footer*/}
      <Footer />
    </div>
  );
};