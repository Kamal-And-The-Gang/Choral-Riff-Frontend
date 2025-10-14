import '../styles/AuthForms.css';
import registrationBanner from '../assets/registration-banner.jpg'; // Mettez votre image de bannière ici

export const Inscription = () => {
  return (
    <div className="home-container">
      <main>
        {/* 2. Formulaire*/}
        <section className="form-section">
          <h2>Inscription</h2>
          <div className="form-card">
            <form>
              <input type="text" placeholder="Nom" className="form-input" />
              <input type="text" placeholder="Prénom" className="form-input" />
              <input type="email" placeholder="Email" className="form-input" />
              <input type="password" placeholder="Mot de passe" className="form-input" />
              <input type="password" placeholder="Confirmation mot de passe" className="form-input" />
              <button type="submit" className="validate-button">Valider</button>
            </form>
          </div>
        </section>

        <section className="banner-section" style={{ backgroundImage: `url(${registrationBanner})` }}>
          <div className="banner-overlay">
            <p>"Simplifiez le partage, l'écoute et l'organisation de vos partitions et fichiers audios"</p>
          </div>
        </section>
      </main>
    </div>
  );
};