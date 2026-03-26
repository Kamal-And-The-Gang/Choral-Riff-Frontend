
// import { Link, useParams, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "../../styles/TrackDetails.css";
// import { FaMusic, FaChevronLeft, FaTrash } from "react-icons/fa";
// import type { FileItem } from "./components/FileItemComponent";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AddInstrumentForm from "../AddInstrumentForm";
// import { handleAddInstrumentSubmit } from "../../api/documentInstruments";
// import { useAuth } from "../../contexts/AuthContext";
// import { fetchEnsembleById } from "../../api/ensemble";

// export type ExtendedFileItem = FileItem & {
//   url?: string;
//   utilisateurId?: number;
// };

// type TrackState = {
//   morceauTitre?: string;
//   ensembleNom?: string;
// };

// // --- Toast personnalisé pour confirmation ---
// const toastConfirmDeleteDocument = () =>
//   new Promise<boolean>((resolve) => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           <p>Voulez-vous vraiment supprimer ce document ?</p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: "8px",
//               marginTop: "10px",
//             }}
//           >
//             <button
//               className="delete-button"
//               onClick={() => {
//                 resolve(true);
//                 closeToast();
//               }}
//             >
//               Oui
//             </button>
//             <button
//               className="delete-button"
//               style={{ background: "#6c757d" }}
//               onClick={() => {
//                 resolve(false);
//                 closeToast();
//               }}
//             >
//               Non
//             </button>
//           </div>
//         </div>
//       ),
//       { autoClose: false, closeOnClick: false }
//     );
//   });

// // --- Composant pour un fichier ---
// type Props = {
//   file: ExtendedFileItem;
//   onDelete?: (id: number) => void;
// };

// const FileItemComponent: React.FC<Props> = ({ file, onDelete }) => (
//   <div className="file-item">
//     <span className="file-name">
//       <FaMusic style={{ marginRight: "6px" }} size={16} />
//       {file.name} ({file.format})
//     </span>
//     {onDelete && (
//       <button
//         className="delete-button compact"
//         onClick={() => onDelete(file.id)}
//         aria-label={`Supprimer le fichier ${file.name}`}
//       >
//         <FaTrash size={12} />
//       </button>
//     )}
//   </div>
// );

// // --- Composant principal ---
// export const TrackDetails = () => {
//   const { ensembleId: routeEnsembleId, trackId: routeTrackId } = useParams<{
//     ensembleId: string;
//     trackId: string;
//   }>();

//   const { token, user } = useAuth();
//   const currentEnsembleId = Number(routeEnsembleId);
//   const currentTrackId = Number(routeTrackId);

//   const [files, setFiles] = useState<ExtendedFileItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
//   const [ensembleNom, setEnsembleNom] = useState<string>("Chargement…");

//   const location = useLocation();
//   const state = location.state as TrackState | undefined;

//   const trackData = {
//     id: currentTrackId,
//     title: state?.morceauTitre ?? "Titre par défaut",
//     ensemble: ensembleNom,
//     ensembleId: currentEnsembleId,
//   };

//   // --- Vérifie si l'utilisateur peut supprimer un document ---
//   const canDelete = (file: ExtendedFileItem) => {
//     if (!user) return false;
//     return user.role === "ADMIN" || user.role === "MODERATEUR" || user.id === file.utilisateurId;
//   };

//   const handleOpenAddInstrument = (documentId: number) => {
//     setSelectedDocumentId(documentId);
//     setIsModalOpen(true);
//   };
//   const handleCloseAddInstrument = () => {
//     setSelectedDocumentId(null);
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchEnsemble = async () => {
//       if (state?.ensembleNom) {
//         setEnsembleNom(state.ensembleNom);
//         return;
//       }
//       if (!token || !user) {
//         setEnsembleNom("Nom inconnu");
//         return;
//       }
//       try {
//         const ensemble = await fetchEnsembleById(currentEnsembleId.toString(), user.id);
//         setEnsembleNom(ensemble.nom);
//       } catch (err) {
//         console.error(err);
//         setEnsembleNom("Nom inconnu");
//       }
//     };
//     fetchEnsemble();
//   }, [currentEnsembleId, state?.ensembleNom, token, user]);

//   useEffect(() => {
//     if (!currentTrackId) return;
//     setLoading(true);
//     setError(null);
//     axios
//       .get(`http://localhost:8080/api/documents/morceau/${currentTrackId}`)
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           const filesFromApi = res.data.map((doc: any) => ({
//             id: doc.id_document,
//             name: doc.urlFichier.split("/").pop() ?? "fichier",
//             type: doc.type,
//             format: doc.format,
//             size: "-",
//             role: doc.type,
//             utilisateurId: doc.utilisateurId,
//           }));
//           setFiles(filesFromApi);
//         } else {
//           setError("Réponse API inattendue");
//         }
//       })
//       .catch((err) => {
//         console.error("Erreur API :", err);
//         setError("Impossible de récupérer les fichiers");
//       })
//       .finally(() => setLoading(false));
//   }, [currentTrackId]);

//   const handleDelete = async (id: number) => {
//     const confirmed = await toastConfirmDeleteDocument();
//     if (!confirmed || !user) return;

//     try {
//       await axios.delete(`http://localhost:8080/api/documents/${id}`, {
//         params: { userId: user.id },
//       });
//       setFiles((prev) => prev.filter((file) => file.id !== id));
//       toast.success("Fichier supprimé avec succès !");
//     } catch (err) {
//       console.error(err);
//       toast.error("Impossible de supprimer le fichier.");
//     }
//   };

//   const handleAddDocument = async (file: File) => {
//     if (!user) return toast.error("Vous devez être connecté pour ajouter un document.");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("type", "partition");
//     formData.append("format", file.name.split(".").pop() || "PDF");
//     formData.append("morceauId", currentTrackId.toString());
//     formData.append("utilisateurId", user.id.toString());

//     try {
//       const res = await axios.post("http://localhost:8080/api/documents/upload", formData);
//       setFiles((prev) => [
//         ...prev,
//         {
//           id: res.data.id_document,
//           name: res.data.urlFichier.split("/").pop(),
//           type: res.data.type,
//           format: res.data.format,
//           size: "-",
//           role: res.data.type,
//           utilisateurId: user.id,
//         },
//       ]);
//       toast.success("Document ajouté !");
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur lors de l'ajout du document");
//     }
//   };

//   return (
//     <div className="track-details-container">
//       <section className="track-header-section detail-header">
//         <div className="fiche-title-box">
//           <h1 className="fiche-title">Fiche Morceau (ID: {currentTrackId})</h1>
//         </div>
//       </section>

//       <main className="details-main">
//         <div className="details-content-card track-card">
//           <div className="track-info-header">
//             <FaMusic size={60} className="big-track-icon" />
//             <div className="track-info-details">
//               <h2>{trackData.title}</h2>
//               <p>
//                 Ensemble : <a href={`/ensembles/${trackData.ensembleId}`}>{trackData.ensemble}</a>
//               </p>
//               <Link to={`/ensembles/${trackData.ensembleId}`} className="back-link">
//                 <FaChevronLeft size={12} /> Retour à l'ensemble
//               </Link>
//             </div>
//           </div>

//           <h3 className="section-title files-section-title">Fichiers disponibles :</h3>

//           <div className="files-list">
//             {loading && <p>Chargement des fichiers...</p>}
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {!loading && files.length === 0 && <p>Aucun fichier disponible pour ce morceau.</p>}

//             {files.map((file) => (
//               <div key={file.id} className="file-with-instrument">
//                 <FileItemComponent file={file} onDelete={canDelete(file) ? handleDelete : undefined} />


//                 <button className="add-instrument-button" onClick={() => handleOpenAddInstrument(file.id)}>
//                   Ajouter un instrument
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div style={{ margin: "16px 0" }}>
//             <button className="add-document-button" onClick={() => document.getElementById("fileInput")?.click()}>
//               Ajouter un document
//             </button>
//             <input
//               type="file"
//               id="fileInput"
//               style={{ display: "none" }}
//               onChange={(e) => e.target.files?.[0] && handleAddDocument(e.target.files[0])}
//             />
//           </div>

//           {isModalOpen && selectedDocumentId && (
//             <AddInstrumentForm
//               onSubmit={async (instrument) => {
//                 try {
//                   await handleAddInstrumentSubmit(selectedDocumentId, instrument);
//                   toast.success("Instrument ajouté !");
//                   handleCloseAddInstrument();
//                 } catch (err) {
//                   console.error(err);
//                   toast.error("Erreur lors de l'ajout de l'instrument");
//                 }
//               }}
//               onClose={handleCloseAddInstrument}
//             />
//           )}
//         </div>
//       </main>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/TrackDetails.css";
import { FaMusic, FaChevronLeft, FaTrash } from "react-icons/fa";
import type { FileItem } from "./components/FileItemComponent";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddInstrumentForm from "../AddInstrumentForm";
import { handleAddInstrumentSubmit } from "../../api/documentInstruments";
import { useAuth } from "../../contexts/AuthContext";
import { fetchEnsembleById } from "../../api/ensemble";

export type ExtendedFileItem = FileItem & {
  url?: string;
  utilisateurId?: number;
   nomOriginal?: string; // <-- Ajouter ici
};

type TrackState = {
  morceauTitre?: string;
  ensembleNom?: string;
};

// --- Toast personnalisé pour confirmation ---
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
              style={{ background: "#6c757d" }}
              onClick={() => {
                resolve(false);
                closeToast();
              }}
            >
              Non
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  });

// --- Composant pour un fichier ---
// type Props = {
//   file: ExtendedFileItem;
//   onDelete?: (id: number) => void;
// };

// const FileItemComponent: React.FC<Props> = ({ file, onDelete }) => (
//   <div className="file-item">
//     {/* Affiche le fichier avec lien vers le backend */}
//     <a
//       className="file-name"
//       href={file.url}
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <FaMusic style={{ marginRight: "6px" }} size={16} />
//       {file.name} ({file.format})
//     </a>
//     {onDelete && (
//       <button
//         className="delete-button compact"
//         onClick={() => onDelete(file.id)}
//         aria-label={`Supprimer le fichier ${file.name}`}
//       >
//         <FaTrash size={12} />
//       </button>
//     )}
//   </div>
// );

type Props = {
  file: ExtendedFileItem;
  onDelete?: (id: number) => void;
};

const FileItemComponent: React.FC<Props> = ({ file, onDelete }) => {
  // Affiche le nom original si disponible, sinon le nom fallback
  const displayName = file.nomOriginal || file.name; // <-- utiliser nomOriginal si dispo
  return (
    <div className="file-item">
      <a
        className="file-name"
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaMusic style={{ marginRight: "6px" }} size={16} />
        {displayName}
      </a>

      {onDelete && (
        <button
          className="delete-button compact"
          onClick={() => onDelete(file.id)}
          aria-label={`Supprimer le fichier ${displayName}`}
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

  const { token, user } = useAuth();
  const currentEnsembleId = Number(routeEnsembleId);
  const currentTrackId = Number(routeTrackId);

  const [files, setFiles] = useState<ExtendedFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [ensembleNom, setEnsembleNom] = useState<string>("Chargement…");

  const location = useLocation();
  const state = location.state as TrackState | undefined;

  const trackData = {
    id: currentTrackId,
    title: state?.morceauTitre ?? "Titre par défaut",
    ensemble: ensembleNom,
    ensembleId: currentEnsembleId,
  };

  // --- Vérifie si l'utilisateur peut supprimer un document ---
  const canDelete = (file: ExtendedFileItem) => {
    if (!user) return false;
    return user.role === "ADMIN" || user.role === "MODERATEUR" || user.id === file.utilisateurId;
  };

  const handleOpenAddInstrument = (documentId: number) => {
    setSelectedDocumentId(documentId);
    setIsModalOpen(true);
  };
  const handleCloseAddInstrument = () => {
    setSelectedDocumentId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchEnsemble = async () => {
      if (state?.ensembleNom) {
        setEnsembleNom(state.ensembleNom);
        return;
      }
      if (!token || !user) {
        setEnsembleNom("Nom inconnu");
        return;
      }
      try {
        const ensemble = await fetchEnsembleById(currentEnsembleId.toString(), user.id);
        setEnsembleNom(ensemble.nom);
      } catch (err) {
        console.error(err);
        setEnsembleNom("Nom inconnu");
      }
    };
    fetchEnsemble();
  }, [currentEnsembleId, state?.ensembleNom, token, user]);

  useEffect(() => {
    if (!currentTrackId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:8080/api/documents/morceau/${currentTrackId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {



//        const filesFromApi = res.data.map((doc: any) => ({
//   id: doc.id_document,
//   name: doc.nomOriginal ?? doc.urlFichier.split("/").pop(), // <- utiliser nomOriginal
//   url: `http://localhost:8080${doc.urlFichier}`,
//   type: doc.type,
//   format: doc.format,
//   size: "-",
//   role: doc.type,
//   utilisateurId: doc.utilisateurId,
// }));
//           setFiles(filesFromApi);

const filesFromApi = res.data.map((doc: any) => ({
  id: doc.id_document,
  nomOriginal: doc.nomOriginal,  // vrai nom du fichier
  name: doc.nomOriginal ?? doc.urlFichier.split("/").pop(),
 url: `http://localhost:8080/api/documents/download/${doc.uuidStored}`,
  type: doc.type,
  format: doc.format,
  size: "-",
  role: doc.type,
  utilisateurId: doc.utilisateurId,
}));
setFiles(filesFromApi);



        } else {
          setError("Réponse API inattendue");
        }
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError("Impossible de récupérer les fichiers");
      })
      .finally(() => setLoading(false));
  }, [currentTrackId]);

  const handleDelete = async (id: number) => {
    const confirmed = await toastConfirmDeleteDocument();
    if (!confirmed || !user) return;

    try {
      await axios.delete(`http://localhost:8080/api/documents/${id}`, {
        params: { userId: user.id },
      });
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success("Fichier supprimé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le fichier.");
    }
  };

  const handleAddDocument = async (file: File) => {
    if (!user) return toast.error("Vous devez être connecté pour ajouter un document.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "partition");
    formData.append("format", file.name.split(".").pop() || "PDF");
    formData.append("morceauId", currentTrackId.toString());
    formData.append("utilisateurId", user.id.toString());

    try {
      const res = await axios.post("http://localhost:8080/api/documents/upload", formData);

      setFiles((prev) => [
  ...prev,
  {
    id: res.data.id_document,
    name: res.data.nomOriginal ?? res.data.urlFichier.split("/").pop(), // <- nom propre
    url: `http://localhost:8080${res.data.urlFichier}`,
    type: res.data.type,
    format: res.data.format,
    size: "-",
    role: res.data.type,
    utilisateurId: user.id,
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
            <FaMusic size={60} className="big-track-icon" />
            <div className="track-info-details">
              <h2>{trackData.title}</h2>
              <p>
                Ensemble : <a href={`/ensembles/${trackData.ensembleId}`}>{trackData.ensemble}</a>
              </p>
              <Link to={`/ensembles/${trackData.ensembleId}`} className="back-link">
                <FaChevronLeft size={12} /> Retour à l'ensemble
              </Link>
            </div>
          </div>

          <h3 className="section-title files-section-title">Fichiers disponibles :</h3>

          <div className="files-list">
            {loading && <p>Chargement des fichiers...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && files.length === 0 && <p>Aucun fichier disponible pour ce morceau.</p>}

            {files.map((file) => (
              <div key={file.id} className="file-with-instrument">
                <FileItemComponent file={file} onDelete={canDelete(file) ? handleDelete : undefined} />

                <button className="add-instrument-button" onClick={() => handleOpenAddInstrument(file.id)}>
                  Ajouter un instrument
                </button>
              </div>
            ))}
          </div>

          <div style={{ margin: "16px 0" }}>
            <button className="add-document-button" onClick={() => document.getElementById("fileInput")?.click()}>
              Ajouter un document
            </button>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleAddDocument(e.target.files[0])}
            />
          </div>

          {isModalOpen && selectedDocumentId && (
            <AddInstrumentForm
              onSubmit={async (instrument) => {
                try {
                  await handleAddInstrumentSubmit(selectedDocumentId, instrument);
                  toast.success("Instrument ajouté !");
                  handleCloseAddInstrument();
                } catch (err) {
                  console.error(err);
                  toast.error("Erreur lors de l'ajout de l'instrument");
                }
              }}
              onClose={handleCloseAddInstrument}
            />
          )}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};