import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

import "../styles/MonEspace.css";
import { FaUsers, FaPlus, FaCrown } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import userProfilePic from "../assets/femme-5222905_1920.jpg";
import ensembleBanner from "../assets/banniere-mon-espace.jpg";
import ProfilePhotoUpdater from "./ProfilePhotoUpdater";

import {
  fetchCurrentUser,
  type Utilisateur as UtilisateurAPI,
} from "../api/UtilisateurApi";
import toast from "react-hot-toast";

// Type des ensembles possibles
export type TypeEnsemble =
  | "CHOEUR"
  | "ORCHESTRE"
  | "QUATUOR"
  | "BAND"
  | "AUTRE";

// Interface représentant un ensemble musical
interface Ensemble {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  nombreMembres: number; // ← correspond au back
  typeEnsemble: TypeEnsemble; // ← correspond au backend
  userRole?: "ADMIN" | "MODERATEUR" | "MEMBRE";
}

// Interface pour chaque élément de la liste
interface EnsembleListItemProps {
  ensemble: Ensemble;
}

// Mapping pour afficher le type d'ensemble de façon lisible
const typeLabels: Record<TypeEnsemble, string> = {
  CHOEUR: "Chorale",
  ORCHESTRE: "Orchestre",
  QUATUOR: "Quatuor",
  BAND: "Groupe de Rock",
  AUTRE: "Autre",
};

export type Utilisateur = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photoProfil?: string;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<UtilisateurAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};




const EnsembleListItem: React.FC<EnsembleListItemProps> = ({ ensemble }) => {
  return (
    <div className="ensemble-card">
      <FaUsers size={40} className="ensemble-icon" aria-hidden="true" />
      <div className="ensemble-details">
        {/* <h3>{ensemble.nom}</h3> */}
        <h3>
          {ensemble.nom}{" "}
          {ensemble.userRole === "ADMIN" && (
            <FaCrown
              title="Administrateur"
              style={{ color: "gold", marginLeft: "5px" }}
              aria-label="Administrateur"
            />
          )}
        </h3>

        <p>Description : {ensemble.description}</p>
        <p>Type : {typeLabels[ensemble.typeEnsemble]}</p>
        <p>Membres : {ensemble.nombreMembres}</p>
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
      </div>
    </div>
  );
};

// Fonction pour récupérer le nombre de membres d'un ensemble
const fetchNombreMembres = async (ensembleId: number) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/ensembles/${ensembleId}/members/count`
    );
    if (!res.ok) throw new Error("Erreur lors du chargement du nombre de membres");
    const count: number = await res.json();
    return count;
  } catch (err: any) {
    console.error(err);
    return 0; // fallback en cas d'erreur
  }
};


// Page principale des ensembles de l'utilisateur
export const EnsemblesPage = () => {
  const location = useLocation();
  const { user, loading: loadingUser, updateUser } = useAuth();

  const navigate = useNavigate();
  const toastShown = useRef(false);
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);

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
        // 1️⃣ On récupère les ensembles de l'utilisateur
        const res = await fetch(`http://localhost:8080/api/ensembles/user/${user.id}`);
        if (!res.ok) throw new Error("Erreur de chargement");
        const data: Ensemble[] = await res.json();

        // 2️⃣ Pour chaque ensemble, on récupère le nombre de membres via le nouvel endpoint
        const ensemblesAvecMembres = await Promise.all(
          data.map(async (ensemble) => {
            const nombreMembres = await fetchNombreMembres(ensemble.id);
            return { ...ensemble, nombreMembres };
          })
        );

        // 3️⃣ On met à jour le state avec le nombre de membres
        setEnsembles(ensemblesAvecMembres);
      } catch (error) {
        toast.error("Erreur lors du chargement des ensembles.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnsembles();
  }, [user]);


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

          {user && (
            <ProfilePhotoUpdater
              currentPhoto={
                user.photoProfil
                  ? `http://localhost:8080${user.photoProfil}?t=${Date.now()}`
                  : userProfilePic
              }
              onPhotoUpdated={(newPath: string) =>
                updateUser({ photoProfil: newPath })
              }
            />
          )}

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
                <EnsembleListItem key={ensemble.id} ensemble={ensemble} />
              ))
            )}
          </div>

          {/* {ensembles.some((e) => e.userRole === "ADMIN") && (
            <div className="add-ensemble-footer-button">
              <Link to="/ajouter-ensemble">
                <button className="submit-button">
                  <FaPlus /> Créer un nouvel ensemble
                </button>
              </Link>
            </div>
          )} */}

          {user && (
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
