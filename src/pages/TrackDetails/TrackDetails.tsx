
import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type ExtendedFileItem = FileItem & {
  url?: string;
  utilisateurId?: number;
  nomOriginal?: string;
  dateAjout?: string;
  instruments?: { id: number; nom: string }[];
  urlYoutube?: string;
};

type TrackState = {
  morceauTitre?: string;
  ensembleNom?: string;
};

// --------------------------------------------------
// MAPPING DOCUMENT
// --------------------------------------------------

const mapDocumentToFile = (doc: any): ExtendedFileItem => ({
  id: doc.id_document,
  name: doc.nomOriginal ?? doc.urlFichier.split("/").pop(),
  nomOriginal: doc.nomOriginal,
  url: `http://localhost:8080${doc.urlFichier}`,
  type: doc.type,
  format: doc.format,
  size: "-",
  role: doc.type,
  utilisateurId: doc.utilisateurId,
  dateAjout: doc.dateAjout,
  instruments: doc.instruments ?? [],
  urlYoutube: doc.urlYoutube,
});


// --------------------------------------------------
// YOUTUBE HELPER
// --------------------------------------------------

const extractYoutubeId = (url: string): string => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : url;
};

// --------------------------------------------------
// CONFIRM DELETE TOAST
// --------------------------------------------------

const toastConfirmDeleteDocument = () =>
  new Promise<boolean>((resolve) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Voulez-vous vraiment supprimer ce document ?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            <button
              className="delete-button"
              onClick={() => { resolve(true); closeToast(); }}
            >
              Oui
            </button>
            <button
              className="delete-button"
              style={{ background: "#6c757d" }}
              onClick={() => { resolve(false); closeToast(); }}
            >
              Non
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  });

// --------------------------------------------------
// FILE ITEM
// --------------------------------------------------

type Props = {
  file: ExtendedFileItem;
  onDelete?: (id: number) => void;
};

const FileItemComponent: React.FC<Props> = ({ file, onDelete }) => {
  const displayName = file.nomOriginal || file.name;
  return (
    <div className="file-item">
      <a className="file-name" href={file.url} target="_blank" rel="noopener noreferrer">
        <FaMusic style={{ marginRight: 6 }} size={16} />
        {displayName}
      </a>
      {onDelete && (
        <button
          className="delete-button compact"
          onClick={() => onDelete(file.id)}
          aria-label={`Supprimer ${displayName}`}
        >
          <FaTrash size={12} />
        </button>
      )}
    </div>
  );
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export const TrackDetails = () => {
  const { ensembleId: routeEnsembleId, trackId: routeTrackId } = useParams<{
    ensembleId: string;
    trackId: string;
  }>();

  const { token, user } = useAuth();

  const currentEnsembleId = Number(routeEnsembleId);
  const currentTrackId = Number(routeTrackId);

  const location = useLocation();
  const state = location.state as TrackState | undefined;

  const [files, setFiles] = useState<ExtendedFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [ensembleNom, setEnsembleNom] = useState("Chargement…");
  const [isPlaying, setIsPlaying] = useState(false);
  const [mutedFiles, setMutedFiles] = useState<number[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
  const gainRefs = useRef<Record<number, GainNode>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const individualAudioRefs = useRef<Record<number, HTMLAudioElement>>({});

  const trackData = {
    id: currentTrackId,
    title: state?.morceauTitre ?? "Titre par défaut",
    ensemble: ensembleNom,
    ensembleId: currentEnsembleId,
  };

  // --------------------------------------------------
  // PERMISSIONS
  // --------------------------------------------------

  const canDelete = (file: ExtendedFileItem) => {
    if (!user) return false;
    const ensembleRole = user.ensembleRoles?.find(
      (r) => Number(r.ensembleId) === currentEnsembleId
    )?.role;
    return (
      ensembleRole === "ADMIN" ||
      ensembleRole === "MODERATEUR" ||
      user.id === file.utilisateurId
    );
  };

  // --------------------------------------------------
  // ENSEMBLE FETCH
  // --------------------------------------------------

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
      } catch {
        setEnsembleNom("Nom inconnu");
      }
    };
    fetchEnsemble();
  }, [currentEnsembleId, state?.ensembleNom, token, user]);

  // --------------------------------------------------
  // FETCH FILES
  // --------------------------------------------------

  useEffect(() => {
    if (!currentTrackId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:8080/api/documents/morceau/${currentTrackId}`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setError("Réponse API inattendue");
          return;
        }
        setFiles(res.data.map(mapDocumentToFile));
      })
      .catch(() => setError("Impossible de récupérer les fichiers"))
      .finally(() => setLoading(false));
  }, [currentTrackId]);

  // --------------------------------------------------
  // AUDIO CLEANUP ON UNMOUNT
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      Object.values(individualAudioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      audioCtxRef.current?.close();
      audioRefs.current = {};
      gainRefs.current = {};
    };
  }, []);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id: number) => {
    const confirmed = await toastConfirmDeleteDocument();
    if (!confirmed || !user) return;
    try {
      await axios.delete(`http://localhost:8080/api/documents/${id}`, {
        params: { userId: user.id },
      });
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("Fichier supprimé !");
    } catch {
      toast.error("Erreur suppression fichier");
    }
  };

  // --------------------------------------------------
  // SINGLE UPLOAD
  // --------------------------------------------------

  const handleAddDocument = async (file: File) => {
    if (!user) return toast.error("Vous devez être connecté");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "partition");
    formData.append("format", file.name.split(".").pop() || "PDF");
    formData.append("morceauId", currentTrackId.toString());
    formData.append("utilisateurId", user.id.toString());
    try {
      const res = await axios.post("http://localhost:8080/api/documents/upload", formData);
      const newFile = mapDocumentToFile(res.data);

      setFiles((prev) => {
        if (prev.some((f) => f.id === newFile.id)) return prev;
        return [...prev, newFile];
      });

      console.log("UPLOAD OK");
      toast.success("Document ajouté !");
    } catch {
      toast.error("Erreur upload");
    }
  };

  // --------------------------------------------------
  // MULTIPLE UPLOAD
  // --------------------------------------------------

  const handleAddTutti = async (fileList: FileList) => {
    if (!user) return toast.error("Vous devez être connecté");
    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("morceauId", currentTrackId.toString());
    formData.append("utilisateurId", user.id.toString());
    try {
      const res = await axios.post(
        "http://localhost:8080/api/documents/upload/morceau",
        formData
      );
      setFiles((prev) => [...prev, ...res.data.map(mapDocumentToFile)]);
      toast.success(`${res.data.length} document(s) ajouté(s)`);
    } catch {
      toast.error("Erreur upload tutti");
    }
  };


  // --------------------------------------------------
  // ADD YOUTUBE
  // --------------------------------------------------

  const handleAddYoutube = async () => {
    if (!user || !youtubeUrl.trim()) return;
    try {
      const res = await axios.post("http://localhost:8080/api/documents/upload/youtube", {
        morceauId: currentTrackId,
        utilisateurId: user.id,
        urlYoutube: youtubeUrl.trim(),
      });
      const newFile = mapDocumentToFile(res.data);
      setFiles((prev) => [...prev, newFile]);
      setYoutubeUrl("");
      toast.success("Lien YouTube ajouté !");
    } catch {
      toast.error("Erreur ajout YouTube");
    }
  };


  // --------------------------------------------------
  // PLAY TUTTI
  // --------------------------------------------------

  const handlePlayTutti = async () => {
    const audioFiles = files.filter(
      (f) => f.url && (f.url.endsWith(".mp3") || f.url.endsWith(".wav") || f.url.endsWith(".ogg"))
    );
    if (!audioFiles.length) return toast.error("Aucun audio compatible");
    try {
      // Coupe les lecteurs individuels pour éviter la superposition
      Object.values(individualAudioRefs.current).forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });

      Object.values(audioRefs.current).forEach((a) => { a.pause(); a.currentTime = 0; });
      audioCtxRef.current?.close();
      audioRefs.current = {};
      gainRefs.current = {};
      audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      audioFiles.forEach((file) => {
        const audio = new Audio(file.url!);
        audio.crossOrigin = "anonymous";
        audioRefs.current[file.id] = audio;
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        // Applique l'état de mute existant dès la création
        gain.gain.value = mutedFiles.includes(file.id) ? 0 : 1;
        source.connect(gain);
        gain.connect(ctx.destination);
        gainRefs.current[file.id] = gain;
      });
      await Promise.all(
        Object.values(audioRefs.current).map(
          (audio) => new Promise<void>((resolve) => { audio.oncanplaythrough = () => resolve(); })
        )
      );
      await Promise.all(
        Object.values(audioRefs.current).map(async (audio) => {
          try { await audio.play(); } catch { }
        })
      );
      setIsPlaying(true);
      toast.success("🎧 Tutti lancé !");
    } catch {
      toast.error("Erreur lecture audio");
    }
  };

  const handleStopTutti = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIsPlaying(false);
    toast.info("Lecture stoppée");
  };

  const handleToggleMute = (fileId: number) => {
    const willMute = !mutedFiles.includes(fileId);

    const audio = individualAudioRefs.current[fileId];
    if (audio) audio.muted = willMute;

    const gain = gainRefs.current[fileId];
    if (gain) gain.gain.value = willMute ? 0 : 1;

    setMutedFiles((prev) =>
      willMute ? [...prev, fileId] : prev.filter((id) => id !== fileId)
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="track-details-container">
      <section className="track-header-section detail-header" />
      <main className="details-main">
        <div className="details-content-card track-card">

          {/* HEADER */}
          <div className="track-info-header">
            <FaMusic size={50} />
            <div>
              <p>
                Ensemble:{" "}
                <a href={`/ensembles/${trackData.ensembleId}`}>{trackData.ensemble}</a>
              </p>
              <h2 className="fiche-title">{trackData.title}</h2>
              <Link to={`/ensembles/${trackData.ensembleId}`}>
                <FaChevronLeft size={12} /> Retour
              </Link>
            </div>
          </div>

          {/* MIXER TITLE */}
          <h3 className="mixer-title">🎚 Mixeur chorale</h3>

          {/* FILE LIST */}
          {loading && <p>Chargement...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && files.length === 0 && <p>Aucun fichier</p>}

          <div className="mixer-grid">
            {files.map((file) => (
              <div key={file.id} className="mixer-card">

                {/* FILE INFO */}
                <FileItemComponent
                  file={file}
                  onDelete={canDelete(file) ? handleDelete : undefined}
                />

                {/* DATE ET INSTRUMENTS */}
                <div className="file-meta">
                  {file.dateAjout && (
                    <span className="file-date">
                      {new Date(file.dateAjout).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {file.instruments && file.instruments.length > 0 && (
                    <div className="file-instruments">
                      {file.instruments.map((inst) => (
                        <span key={inst.id} className="instrument-tag">
                          🎵 {inst.nom}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="mixer-actions">
                  {canDelete(file) && file.format !== "youtube" && (
                    <button
                      className="btn-small"
                      onClick={() => setSelectedDocumentId(file.id)}
                    >
                      Instrument
                    </button>
                  )}
                  {file.url?.match(/\.(mp3|wav|ogg)$/) && (
                    <button
                      className="btn-small"
                      onClick={() => handleToggleMute(file.id)}
                    >
                      {mutedFiles.includes(file.id) ? "🔇 Unmute" : "🔈 Mute"}
                    </button>
                  )}
                </div>
                {/* LECTEUR AUDIO INDIVIDUEL */}
                {file.url?.match(/\.(mp3|wav|ogg)$/i) && (
                  <audio
                    ref={(el) => {
                      if (el) individualAudioRefs.current[file.id] = el;
                    }}
                    controls
                    src={file.url}
                    onPlay={() => {
                      Object.values(audioRefs.current).forEach((a) => a.pause());
                      Object.entries(individualAudioRefs.current).forEach(([id, a]) => {
                        if (Number(id) !== file.id) a.pause();
                      });
                      if (isPlaying) setIsPlaying(false);
                    }}
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                )}



                {/* LECTEUR YOUTUBE */}
                {file.urlYoutube && (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${extractYoutubeId(file.urlYoutube)}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    style={{ marginTop: "8px", borderRadius: "8px", border: "none" }}
                  />
                )}

              </div>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="controls-wrapper">

            <div className="controls-group">
              <span className="controls-label">Lecture</span>
              <div className="controls-row">
                <button onClick={handlePlayTutti} disabled={isPlaying}>🎧 Play</button>
                <button onClick={handleStopTutti} disabled={!isPlaying}>⏹ Stop</button>
                {isPlaying && (
                  <div className="playing-indicator">
                    <span className="playing-dot"></span>
                    <span>Lecture en cours...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="controls-group">
              <span className="controls-label">Documents</span>
              <div className="controls-row">
                <div className="upload-group">
                  <button onClick={() => document.getElementById("fileInput")?.click()}>
                    Ajouter partition
                  </button>
                  <span className="upload-hint">PDF, Word, ODT</span>
                  <input
                    id="fileInput"
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.odt"
                    onChange={(e) => e.target.files?.[0] && handleAddDocument(e.target.files[0])}
                  />
                </div>
                <div className="upload-group">
                  <button onClick={() => document.getElementById("fileInputTutti")?.click()}>
                    Ajouter pistes audio
                  </button>
                  <span className="upload-hint">MP3, WAV, OGG — plusieurs fichiers</span>
                  <input
                    id="fileInputTutti"
                    type="file"
                    multiple
                    hidden
                    accept=".mp3,.wav,.ogg"
                    onChange={(e) => e.target.files && handleAddTutti(e.target.files)}
                  />
                </div>
              </div>
              <div className="upload-group">
                <input
                  type="text"
                  placeholder="URL YouTube (ex: https://www.youtube.com/watch?v=...)"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <button onClick={handleAddYoutube} disabled={!youtubeUrl.trim()}>
                  Ajouter lien YouTube
                </button>
              </div>
            </div>

          </div>

          {/* MODAL */}
          {selectedDocumentId && (
            <AddInstrumentForm
              onSubmit={async (instrument) => {
                try {
                  const res = await handleAddInstrumentSubmit(selectedDocumentId, instrument);
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === selectedDocumentId
                        ? { ...f, instruments: res.instruments ?? [] }
                        : f
                    )
                  );
                  toast.success("Instrument ajouté !");
                  setSelectedDocumentId(null);
                } catch {
                  toast.error("Erreur instrument");
                }
              }}
              onClose={() => setSelectedDocumentId(null)}
            />
          )}

        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};