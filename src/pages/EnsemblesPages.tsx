// import React, { useEffect, useRef, useState } from "react";
// import Spinner from "./Spinner";

// import "../styles/MonEspace.css";
// import { FaUsers, FaPlus } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// import ensembleBanner from "../assets/banniere-mon-espace.jpg";
// import userProfilePic from "../assets/avatar-michelle.jpg";
// import toast from "react-hot-toast";

// // Interface représentant un ensemble musical
// interface Ensemble {
//   id: number;
//   nom: string;
//   description: string;
//   dateCreation: string;
//   members: number;
//   type: string;
//   userRole?: "ADMIN" | "MODERATEUR" | "MEMBRE";
// }

// interface EnsembleListItemProps {
//   ensemble: Ensemble;
// }

// const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => {
//   console.log(
//     "Rôle de l'utilisateur pour",
//     ensemble.nom,
//     ":",
//     ensemble.userRole
//   );

//   return (
//     <div className="ensemble-card">
//       <FaUsers size={40} className="ensemble-icon" aria-hidden="true" />
//       <div className="ensemble-details">
//         <h3>{ensemble.nom}</h3>
//         <p>Description : {ensemble.description}</p>
//         <p>Type : {ensemble.type}</p>
//         <p>{ensemble.members} Membres</p>
//       </div>

//       <div className="ensemble-actions">
//         <Link to={`/ensembles/${ensemble.id}`}>
//           <button
//             className="view-ensemble-button"
//             aria-label={`Voir les partitions de ${ensemble.nom}`}
//           >
//             Voir les partitions
//           </button>
//         </Link>

//         {/* ===== BOUTON "Ajouter un instrument" VISIBLE UNIQUEMENT POUR LES ADMINS ===== */}
//         {ensemble.userRole === "ADMIN" && (
//           <Link to={`/ensembles/${ensemble.id}/ajouter-instrument`}>
//             <button
//               className="add-instrument-button"
//               aria-label={`Ajouter un instrument à l'ensemble ${ensemble.nom}`}
//             >
//               <FaPlus size={14} style={{ marginRight: "6px" }} />
//               Ajouter un instrument
//             </button>
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// // Page principale des ensembles de l'utilisateur
// export const EnsemblesPage = () => {
//   const location = useLocation();
//   const { user, loading: loadingUser } = useAuth();

//   console.log("User dans EnsemblesPage :", user);
//   const navigate = useNavigate();
//   const toastShown = useRef(false);
//   const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect pour afficher le toast de succès si redirection après création d'ensemble
//   useEffect(() => {
//     if (location.state?.successMessage && !toastShown.current) {
//       toast.success(location.state.successMessage);
//       toastShown.current = true;
//       // Remplace l'état de navigation pour ne plus afficher le toast après refresh
//       setTimeout(() => {
//         navigate(location.pathname, { replace: true, state: {} });
//       }, 100);
//     }
//   }, [location.state, navigate]);

//   useEffect(() => {
//     if (!user) return;
//     const fetchEnsembles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:8080/api/ensembles/user/${user.id}`
//         );
//         if (!res.ok) throw new Error("Erreur de chargement");
//         const data: Ensemble[] = await res.json();
//         setEnsembles(data);
//       } catch (error) {
//         toast.error("Erreur lors du chargement des ensembles.");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEnsembles();
//   }, [user]);

//   //  Spinner si chargement
//   if (loadingUser) {
//     return <Spinner message="Chargement de l'utilisateur..." />;
//   }
//   if (!user) {
//     return <p>Vous devez être connecté pour voir cette page.</p>;
//   }
//   if (loading) {
//     return (
//       <div className="details-container">
//         <Spinner message="Chargement de l'ensemble..." />
//       </div>
//     );
//   }
//   // Rendu principal de la page
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
//             {/* <p className="profile-name">
//               {user
//                 ? `${user.prenom ?? ""} ${user.nom ?? ""}`
//                 : "Utilisateur inconnu"}
//             </p> */}
//             <p
//               className="profile-name"
//               aria-label={`Profil de ${user.prenom} ${user.nom}`}
//             >
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
//             {ensembles.length === 0 ? (
//               <p role="status">Vous n’avez aucun ensemble pour le moment.</p>
//             ) : (
//               ensembles.map((ensemble) => (
//                 <EnsembleListItem
//                 key={ensemble.id}
//                 ensemble={ensemble}
//                 // currentUserRole={user.role} // <-- rôle de l'utilisateur connecté

//                 />
//               ))
//             )}
//           </div>

//           {/* <div className="add-ensemble-footer-button">
//             <Link to="/ajouter-ensemble">
//               <button className="submit-button">
//                 <FaPlus /> Créer un nouvel ensemble
//               </button>
//             </Link>
//           </div> */}

//           {user.globalRole === "ADMIN" && (
//   <div className="add-ensemble-footer-button">
//     <Link to="/ajouter-ensemble">
//       <button className="submit-button">
//         <FaPlus /> Créer un nouvel ensemble
//       </button>
//     </Link>
//   </div>
// )}

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
// Si tu veux importer le type dans un composant

import {
  addInstrumentToEnsemble,
  type InstrumentDto,
} from "../api/instruments";

import ensembleBanner from "../assets/banniere-mon-espace.jpg";
import userProfilePic from "../assets/avatar-michelle.jpg";
import toast from "react-hot-toast";

// Type des ensembles possibles
export type TypeEnsemble =
  | "ORCHESTRE"
  | "CHORALE"
  | "BAND"
  | "QUARTET"
  | "AUTRE";


// Interface représentant un ensemble musical
interface Ensemble {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  members: number;
   type: TypeEnsemble; // ← ici on utilise notre type TypeEnsemble
  userRole?: "ADMIN" | "MODERATEUR" | "MEMBRE";
}

// Interface pour chaque élément de la liste
interface EnsembleListItemProps {
  ensemble: Ensemble;
  onAddInstrument?: (ensembleId: number, instrument: string) => void;
}

// Mapping pour afficher le type d'ensemble de façon lisible
const typeLabels: Record<TypeEnsemble, string> = {
  ORCHESTRE: "Orchestre",
  CHORALE: "Chorale",
  BAND: "Groupe de Rock",
  QUARTET: "Quatuor",
  AUTRE: "Autre",
};

const EnsembleListItem: React.FC<EnsembleListItemProps> = ({
  ensemble,
  onAddInstrument,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instrumentName, setInstrumentName] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    if (!instrumentName) return;
    onAddInstrument?.(ensemble.id, instrumentName);
    setInstrumentName("");
    closeModal();
  };

  return (
    <div className="ensemble-card">
      <FaUsers size={40} className="ensemble-icon" aria-hidden="true" />
      <div className="ensemble-details">
        <h3>{ensemble.nom}</h3>
        <p>Description : {ensemble.description}</p>
       <p>Type : {typeLabels[ensemble.type]}</p> {/* ← Lisible */}
        <p>{ensemble.members} Membres</p>
      </div>

      <div className="ensemble-actions">
        <Link to={`/ensembles/${ensemble.id}`}>
          <button
            className="view-ensemble-button"
            aria-label={`Voir les partitions de ${ensemble.nom}`}
          >
            Voir les partitions
          </button>
        </Link>

        {ensemble.userRole === "ADMIN" && (
          <>
            <button
              className="add-instrument-button"
              onClick={openModal}
              aria-label={`Ajouter un instrument à l'ensemble ${ensemble.nom}`}
            >
              <FaPlus size={14} style={{ marginRight: "6px" }} />
              Ajouter un instrument
            </button>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Ajouter un instrument à {ensemble.nom}</h3>
                  <input
                    type="text"
                    placeholder="Nom de l'instrument"
                    value={instrumentName}
                    onChange={(e) => setInstrumentName(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button onClick={handleSubmit}>Ajouter</button>
                    <button onClick={closeModal}>Annuler</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Page principale des ensembles de l'utilisateur
export const EnsemblesPage = () => {
  const location = useLocation();
  const { user, loading: loadingUser } = useAuth();

  const navigate = useNavigate();
  const toastShown = useRef(false);
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);

   console.log("ROLE GLOBAL :", user?.globalRole);


  // Liste des instruments ajoutés pour chaque ensemble (optionnel)
  const [ensembleInstruments, setEnsembleInstruments] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage);
      toastShown.current = true;
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchEnsembles = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/ensembles/user/${user.id}`
        );
        if (!res.ok) throw new Error("Erreur de chargement");
        const data: Ensemble[] = await res.json();
        setEnsembles(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des ensembles.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnsembles();
  }, [user]);

  
  const handleAddInstrument = async (
    ensembleId: number,
    instrumentName: string
  ) => {
    if (!user) return;

    const instrument: InstrumentDto = { nom: instrumentName };

    try {
      const savedInstrument = await addInstrumentToEnsemble(
        ensembleId,
        user.id,
        instrument
      );

      setEnsembleInstruments((prev) => ({
        ...prev,
        [ensembleId]: [...(prev[ensembleId] || []), savedInstrument.nom],
      }));

      toast.success(`Instrument "${savedInstrument.nom}" ajouté !`);
    } catch {
      toast.error("Impossible d'ajouter l'instrument.");
    }
  };

  if (loadingUser) return <Spinner message="Chargement de l'utilisateur..." />;
  if (!user) return <p>Vous devez être connecté pour voir cette page.</p>;
  if (loading) return <Spinner message="Chargement de l'ensemble..." />;

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
            <p
              className="profile-name"
              aria-label={`Profil de ${user.prenom} ${user.nom}`}
            >
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
              <p role="status">Vous n’avez aucun ensemble pour le moment.</p>
            ) : (
              ensembles.map((ensemble) => (
                <div key={ensemble.id}>
                  <EnsembleListItem
                    ensemble={ensemble}
                    onAddInstrument={handleAddInstrument}
                  />
                  {/* Affichage des instruments ajoutés */}
                  {ensembleInstruments[ensemble.id] && (
                    <ul>
                      {ensembleInstruments[ensemble.id].map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>

          {ensembles.some(e => e.userRole === "ADMIN") && (
            <div className="add-ensemble-footer-button">
              <Link to="/ajouter-ensemble">
                <button className="submit-button">
                  <FaPlus /> Créer un nouvel ensemble
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
