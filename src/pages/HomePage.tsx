import '../styles/HomePage.css';
import { FaUsers, FaFileAlt, FaPlayCircle, FaHandshake } from 'react-icons/fa';
import ellipseImage from '../assets/Ellipse_21.png';
import heroImage from '../assets/hero-background.jpg'
import avatarLucas from '../assets/simon-lohmann-0KAEhUHvcmQ-unsplash.jpg';
import avatarFlo from '../assets/femme-5222890_1920.jpg';



export const HomePage = () => {
  return (
    <div className="home-container">
      <main>
        {/* 2. Section "Hero" */}
        <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-overlay">
            <h1>"Simplifiez le partage, l'écoute et l'organisation"</h1>
          </div>
        </section>

        {/* 3. Section "Features" */}
        <section className="features-section">
          <h2>Choral Riff, votre allié pour la musique !</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FaUsers size={30} />
              <span>Multi-profils</span>
            </div>
            <div className="feature-item">
              <FaFileAlt size={30} />
              <span>Tous formats</span>
            </div>
            <div className="feature-item">
              <FaPlayCircle size={30} />
              <span>Écoute directe</span>
            </div>
            <div className="feature-item">
              <FaHandshake size={30} />
              <span>Collaboration fluide</span>
            </div>
          </div>
        </section>

        {/* 4. Section "Testimonials" */}
        <section className="testimonials-section">
          <h3>"Ce que nos utilisateurs en disent"</h3>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <img src={avatarLucas} alt="Lucas, chef de coeur" />
              <p>"Lucas, chef de coeur : Choral Riff a transformé notre gestion des partitions. Simple et collaboratif !"</p>
            </div>
            <div className="testimonial-card">
              <img src={avatarFlo} alt="Flo, professeur de musique" />
              <p>"Flo, professeur de musique : Compatible avec tous mes fichiers, parfait pour mes cours !"</p>
            </div>
          </div>
        </section>

        {/* 5. Section "Call to Action" */}
        <section className="cta-section">
          <div className="cta-box">
            <h4>Entre dans la vibe !</h4>
            <a href="/Inscription">
              <button className="cta-button">
                S'inscrire
                {/* <span className="sound-wave">|||</span> */}
                <img src={ellipseImage} alt="onde sonore" className="sound-wave-img" />

              </button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};