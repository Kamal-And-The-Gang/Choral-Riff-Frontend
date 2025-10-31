// import React, { useEffect, useRef, useState } from "react";
// import Spinner from "./Spinner";

// import "../styles/MonEspace.css";
// import { FaUsers, FaPlus } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// import ensembleBanner from "../assets/banniere-mon-espace.jpg";
// import userProfilePic from "../assets/avatar-michelle.jpg";
// import toast from "react-hot-toast";

// interface Ensemble {
//   id: number;
//   nom: string;
//   description: string;
//   dateCreation: string;
//   members: number;
//   type: string;
// }

// interface EnsembleListItemProps {
//   ensemble: Ensemble;
// }

// /**
//  *
//  *
//  * @param {*} { ensemble }
//  */
// // const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble, userRole }) => (
// //   <Link to={`/ensembles/${ensemble.id}`} className="ensemble-list-item-link">
// //     <div className="ensemble-card">
// //       <FaUsers size={40} className="ensemble-icon" />
// //       <div className="ensemble-details">
// //         <h3>{ensemble.nom}</h3>
// //         <p>Description : {ensemble.description}</p>
// //         <p>Créé le : {new Date(ensemble.dateCreation).toLocaleDateString()}</p>
// //         <p>Type : {ensemble.type}</p>
// //         <p>{ensemble.members} membres :</p>
// //       </div>
// //       <button className="view-ensemble-button">Voir les partitions</button>
// //     </div>
// //   </Link>
// // );

// const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => {
//   return (
//     <div className="ensemble-card">
//       <FaUsers size={40} className="ensemble-icon" />
//       <div className="ensemble-details">
//         <h3>{ensemble.nom}</h3>
//         <p>Description : {ensemble.description}</p>
//         <p>Créé le : {new Date(ensemble.dateCreation).toLocaleDateString()}</p>
//         <p>Type : {ensemble.type}</p>
//         <p>{ensemble.members} membres :</p>
//       </div>

//       <div className="ensemble-actions">
//         <Link to={`/ensembles/${ensemble.id}`}>
//           <button className="view-ensemble-button">Voir les partitions</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export const EnsemblesPage = () => {
//   const location = useLocation();
//   const { user } = useAuth();
//   console.log("User dans EnsemblesPage :", user); // ← ici
//   const navigate = useNavigate();
//   const toastShown = useRef(false);
//   const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (location.state?.successMessage && !toastShown.current) {
//       toast.success(location.state.successMessage);
//       toastShown.current = true;

//       setTimeout(() => {
//         navigate(location.pathname, { replace: true, state: {} });
//       }, 100);
//     }

//     fetch("http://localhost:8080/api/ensembles")
//       .then((res) => res.json())
//       .then((data) => {
//         setEnsembles(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Erreur lors du chargement des ensembles :", error);
//         setLoading(false);
//       });
//   }, [location.state?.refresh, location.state?.successMessage]);

//   // Exemple pour le chargement de l'ensemble
//   const canEdit = !!user; //selon le rôle
//   if (loading) {
//     return (
//       <div className="details-container">
//         <Spinner message="Chargement de l'ensemble..." />
//       </div>
//     );
//   }
//   return (
//     <div className="ensembles-container">
//       <section
//         className="ensembles-banner"
//         style={{ backgroundImage: `url(${ensembleBanner})` }}
//       >
//         <div className="banner-overlay">
//           <h2>Mon espace</h2>
//         </div>
//       </section>

//       <main className="ensembles-main">
//         <div className="profile-section">
//           <img
//             src={userProfilePic}
//             alt="Photo de profil"
//             className="profile-pic"
//           />
//           <div className="profile-info">
//             <p className="profile-name">
//               {user
//                 ? `${user.prenom ?? ""} ${user.nom ?? ""}`
//                 : "Utilisateur inconnu"}
//             </p>
//           </div>
//         </div>

//         <section className="ensembles-list-section">
//           <div className="ensembles-header-section">
//             <h2>Mes Ensembles Musicaux</h2>
//           </div>

//           <div className="ensembles-list">
//             {ensembles.map((ensemble) => (
//               <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
//             ))}
//           </div>

//           {/* <div className="add-ensemble-footer-button">
//             <a href="/ajouter-ensemble">
//               <button className="submit-button">
//                 <FaPlus /> Créer un nouvel ensemble
//               </button>
//             </a>
//           </div> */}
//           <div className="add-ensemble-footer-button">
//             <Link to="/ajouter-ensemble">
//               <button className="submit-button">
//                 <FaPlus /> Créer un nouvel ensemble
//               </button>
//             </Link>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };
import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

import "../styles/MonEspace.css";
import { FaUsers, FaPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import ensembleBanner from "../assets/banniere-mon-espace.jpg";
import userProfilePic from "../assets/avatar-michelle.jpg";
import toast from "react-hot-toast";

interface Ensemble {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  members: number;
  type: string;
}

interface EnsembleListItemProps {
  ensemble: Ensemble;
}

const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => {
  return (
    <div className="ensemble-card">
      <FaUsers size={40} className="ensemble-icon" />
      <div className="ensemble-details">
        <h3>{ensemble.nom}</h3>
        <p>Description : {ensemble.description}</p>
        {/* <p>Créé le : {new Date(ensemble.dateCreation).toLocaleDateString()}</p> */}
        {/* <p>Créé par : {ensemble.createdByName}</p> */}

        <p>Type : {ensemble.type}</p>
        <p>{ensemble.members} membres :</p>
      </div>

      <div className="ensemble-actions">
        <Link to={`/ensembles/${ensemble.id}`}>
          <button className="view-ensemble-button">Voir les partitions</button>
        </Link>
      </div>
    </div>
  );
};

export const EnsemblesPage = () => {
  const location = useLocation();
  const { user, loading: loadingUser } = useAuth();

  if (loadingUser) {
    return <Spinner message="Chargement de l'utilisateur..." />;
  }

  if (!user) {
    return <p>Vous devez être connecté pour voir cette page.</p>;
  }
  console.log("User dans EnsemblesPage :", user);
  const navigate = useNavigate();
  const toastShown = useRef(false);
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);

  // ← ICI : si user n’est pas encore chargé, on affiche un spinner
  if (!user) {
    return <Spinner message="Chargement de l'utilisateur..." />;
  }

  // 🔹 useEffect pour gérer le toast de succès
  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage);
      toastShown.current = true;

      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, navigate]);

  // 🔹 useEffect pour charger les ensembles après que user soit défini
  useEffect(() => {
    if (!user) return; // attendre que user soit chargé depuis le token
    // fetch(`http://localhost:8080/api/ensembles/user/${user.id}`)
    fetch("https://localhost/api/ensembles")
      .then((res) => res.json())
      .then((data: Ensemble[]) => {
        // 🔹 filtrer uniquement les ensembles où l'utilisateur a un rôle
        const userEnsembles = data.filter((e) =>
          user.ensembleRoles?.some((r) => r.ensembleId === e.id.toString())
        );
        setEnsembles(userEnsembles);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des ensembles :", error);
        setLoading(false);
      });
  }, [user]); // dépendance sur user pour attendre qu'il soit défini

  // 🔹 Spinner si chargement
  if (loading) {
    return (
      <div className="details-container">
        <Spinner message="Chargement de l'ensemble..." />
      </div>
    );
  }

  return (
    <div className="ensembles-container">
      <section
        className="ensembles-banner"
        style={{ backgroundImage: `url(${ensembleBanner})` }}
      >
        <div className="banner-overlay">
          <h2>Mon espace</h2>
        </div>
      </section>

      <main className="ensembles-main">
        <div className="profile-section">
          <img
            src={userProfilePic}
            alt="Photo de profil"
            className="profile-pic"
          />
          <div className="profile-info">
            <p className="profile-name">
              {user
                ? `${user.prenom ?? ""} ${user.nom ?? ""}`
                : "Utilisateur inconnu"}
            </p>
          </div>
        </div>

        <section className="ensembles-list-section">
          <div className="ensembles-header-section">
            <h2>Mes Ensembles Musicaux</h2>
          </div>

          <div className="ensembles-list">
            {ensembles.length === 0 ? (
              <p>Vous n’avez aucun ensemble pour le moment.</p> // 🔹 message si aucun ensemble
            ) : (
              ensembles.map((ensemble) => (
                <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
              ))
            )}
          </div>

          <div className="add-ensemble-footer-button">
            <Link to="/ajouter-ensemble">
              <button className="submit-button">
                <FaPlus /> Créer un nouvel ensemble
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
