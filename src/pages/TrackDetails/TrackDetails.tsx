import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/TrackDetails.css";
import { FaMusic, FaChevronLeft, FaTrash } from "react-icons/fa";
import type { FileItem } from "./components/FileItemComponent";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useLocation } from "react-router-dom";

type TrackState = {
  morceauTitre?: string;
  ensembleNom?: string;
};

// --- Toast personnalisé de confirmation ---
const toastConfirmDeleteDocument = () =>
  new Promise<boolean>((resolve) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Voulez-vous vraiment supprimer ce document ?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <button
              className="delete-button"
              onClick={() => {
                resolve(true);
                closeToast();
              }}
            >
              Oui
            </button>

            <button
              className="delete-button"
              onClick={() => {
                resolve(false);
                closeToast();
              }}
              style={{
                background: "#6c757d",
              }}
            >
              Non
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  });

// --- Composant pour un fichier individuel ---
type Props = {
  file: FileItem;
  onDelete?: (id: number) => void;
};

const FileItemComponent: React.FC<Props> = ({ file, onDelete }) => {
  return (
    <div className="file-item">
      <span className="file-name">
        <FaMusic style={{ marginRight: "6px" }} size={16} />
        {file.name} ({file.format})
      </span>
      {onDelete && (
        <button
          className="delete-button compact"
          onClick={() => onDelete(file.id)}
          aria-label={`Supprimer le fichier ${file.name}`}
        >
          <FaTrash size={12} />
        </button>
      )}
    </div>
  );
};

// --- Composant principal ---
export const TrackDetails = () => {
  const { ensembleId: routeEnsembleId, trackId: routeTrackId } = useParams<{
    ensembleId: string;
    trackId: string;
  }>();

  const currentEnsembleId = Number(routeEnsembleId);
  const currentTrackId = Number(routeTrackId);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const state = location.state as TrackState | undefined;

  const [ensembleNom, setEnsembleNom] = useState<string>("Chargement…");

  const trackData = {
    id: currentTrackId,
    title: state?.morceauTitre ?? "Titre par défaut",
    ensemble: ensembleNom,
    ensembleId: currentEnsembleId,
  };

  useEffect(() => {
    if (state?.ensembleNom) {
      setEnsembleNom(state.ensembleNom);
    } else {
      axios
        .get(`https://51.210.7.37/api/ensembles/${currentEnsembleId}`)
        .then((res) => setEnsembleNom(res.data.nom))
        .catch((err) => {
          console.error(err);
          setEnsembleNom("Nom inconnu");
        });
    }
  }, [currentEnsembleId, state?.ensembleNom]);

  // --- Récupération des documents du morceau ---
  useEffect(() => {
    if (!currentTrackId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`https://51.210.7.37/api/documents/morceau/${currentTrackId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const filesFromApi: FileItem[] = res.data.map((doc: any) => ({
            id: doc.id_document,
            name: doc.urlFichier.split("/").pop(),
            type: doc.type,
            format: doc.format,
            size: "-",
            role: doc.type,
          }));
          setFiles(filesFromApi);
        } else {
          setError("Réponse API inattendue");
          console.error(res.data);
        }
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError("Impossible de récupérer les fichiers");
      })
      .finally(() => setLoading(false));
  }, [currentTrackId]);

  // --- Suppression d'un document ---
  const handleDelete = async (id: number) => {
    const confirmed = await toastConfirmDeleteDocument();
    if (!confirmed) return;

    try {
      await axios.delete(`https://51.210.7.37/api/documents/${id}`);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success("Fichier supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      toast.error("Impossible de supprimer le fichier.");
    }
  };

  // --- Ajout d'un document ---
  const handleAddDocument = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "partition"); // ou "audio" selon besoin
    formData.append("format", file.name.split(".").pop() || "PDF");
    formData.append("morceauId", currentTrackId.toString());
    formData.append("utilisateurId", "1"); // ID de l'utilisateur courant

    try {
      const res = await axios.post(
        "https://51.210.7.37/api/documents/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFiles((prev) => [
        ...prev,
        {
          id: res.data.id_document,
          name: res.data.urlFichier.split("/").pop(),
          type: res.data.type,
          format: res.data.format,
          size: "-",
          role: res.data.type,
        },
      ]);

      toast.success("Document ajouté !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout du document");
    }
  };

  return (
    <div className="track-details-container">
      <section className="track-header-section detail-header">
        <div className="fiche-title-box">
          <h1 className="fiche-title">Fiche Morceau (ID: {currentTrackId})</h1>
        </div>
      </section>

      <main className="details-main">
        
        <div className="details-content-card track-card">
          <div className="track-info-header">
            <FaMusic size={60} className="big-track-icon" arria-hidden="true" />
            <div className="track-info-details">
              <h2>{trackData.title}</h2>
              <p>
                Ensemble :{" "}
                <a href={`/ensembles/${trackData.ensembleId}`}>
                  {trackData.ensemble}
                </a>
              </p>
            </div>
          </div>

          <a href={`/ensembles/${trackData.ensembleId}`} className="back-link">
            <FaChevronLeft size={12} /> Retour à l'ensemble
          </a>

          <h3 className="section-title files-section-title">
            Fichiers disponibles :
          </h3>

          <div
            className="files-list"
            role="region"
            aria-label="Liste des fichiers du morceau"
          >
            {loading && <p>Chargement des fichiers...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && files.length === 0 && (
              <p>Aucun fichier disponible pour ce morceau.</p>
            )}
            {files.map((file) => (
              <FileItemComponent
                key={file.id}
                file={file}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* --- Bouton Ajouter un document ---
          <div style={{ margin: "16px 0" }}>
            <button
              className="add-document-button"
              onClick={() => document.getElementById("fileInput")?.click()}
              aria-label="Ajouter un document pour ce morceau"
            >
              Ajouter un document
            </button>
            <label htmlFor="fileInput" className="sr-only">
              Sélectionner un fichier à ajouter
            </label>

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAddDocument(file);
              }}
            />
          </div> */}


          {/* --- Champ fichier + bouton alignés --- */}
<div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0" }}>
  <label htmlFor="fileInput">
    Sélectionner un fichier à ajouter
  </label>

  <button
    className="add-document-button"
    onClick={() => {
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      fileInput?.click();
    }}
    aria-label="Ajouter un document pour ce morceau"
  >
    Ajouter un document
  </button>

  <input
    type="file"
    id="fileInput"
    style={{ display: "none" }}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) handleAddDocument(file);
    }}
  />
</div>


          {/* <div className="global-actions">
            <button
              className="download-all-button"
              onClick={() => alert("Téléchargement de tous les fichiers...")}
            >
              <FaDownload size={18} /> Télécharger tous les fichiers
            </button>
          </div> */}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
