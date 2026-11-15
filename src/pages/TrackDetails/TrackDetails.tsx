

import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import "../../styles/TrackDetails.css";
import {
  getDocumentsByMorceau,
  deleteDocument,
  uploadPartition,
} from "../../api/documentApi";
import {
  FaMusic,
  FaChevronLeft,
  FaTrash,
  FaPlay,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaPlus,
  FaYoutube,
  FaHeadphones,
  FaFileAlt,
  FaSlidersH,
  FaExternalLinkAlt,
} from "react-icons/fa";

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
  nomOriginal?: string;
  dateAjout?: string;
  instruments?: { id: number; nom: string }[];
  urlYoutube?: string;
};

type TrackState = {
  morceauTitre?: string;
  ensembleNom?: string;
};

const API_URL = "http://localhost:8080";

const mapDocumentToFile = (doc: any): ExtendedFileItem => {
  const fileUrl = doc.urlFichier
    ? doc.urlFichier.startsWith("http")
      ? doc.urlFichier
      : `${API_URL}${doc.urlFichier}`
    : undefined;

  return {
    id: doc.id_document,
    name:
      doc.nomOriginal ??
      doc.urlFichier?.split("/").pop() ??
      "Document",
    nomOriginal: doc.nomOriginal,
    url: fileUrl,
    type: doc.type,
    format: doc.format,
    size: "-",
    role: doc.type,
    utilisateurId: doc.utilisateurId,
    dateAjout: doc.dateAjout,
    instruments: doc.instruments ?? [],
    urlYoutube: doc.urlYoutube,
  };
};

const isAudioFile = (file: ExtendedFileItem): boolean => {
  const type = String(file.type ?? "").toLowerCase();
  const format = String(file.format ?? "").toLowerCase();
  const url = String(file.url ?? "");

  return (
    type.startsWith("audio/") ||
    ["mp3", "wav", "ogg"].includes(format) ||
    /\.(mp3|wav|ogg)(?:$|[?#])/i.test(url)
  );
};

const extractYoutubeId = (url: string): string => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?/]+)/
  );

  return match ? match[1] : url;
};

type FileProps = {
  file: ExtendedFileItem;
  onDelete?: (id: number) => void;
};

const FileItemComponent: FC<FileProps> = ({ file, onDelete }) => {
  const displayName = file.nomOriginal || file.name;

  return (
    <div className="td-file-heading">
      <div className="td-file-icon">
        {isAudioFile(file) ? (
          <FaHeadphones />
        ) : file.urlYoutube ? (
          <FaYoutube />
        ) : (
          <FaFileAlt />
        )}
      </div>

      <div className="td-file-name-wrap">
        {file.url ? (
          <a
            className="td-file-name"
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            title={displayName}
          >
            {displayName}
            <FaExternalLinkAlt className="td-external-icon" />
          </a>
        ) : (
          <span className="td-file-name" title={displayName}>
            {displayName}
          </span>
        )}

        <span className="td-file-type">
          {file.urlYoutube
            ? "Vidéo YouTube"
            : isAudioFile(file)
              ? "Piste audio"
              : "Document"}
        </span>
      </div>

      {onDelete && (
        <button
          className="td-icon-button td-delete-button"
          onClick={() => onDelete(file.id)}
          aria-label={`Supprimer ${displayName}`}
          title="Supprimer"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export const TrackDetails = () => {
  const {
    ensembleId: routeEnsembleId,
    trackId: routeTrackId,
  } = useParams<{
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
  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);
  const [ensembleNom, setEnsembleNom] = useState("Chargement…");
  const [isPlaying, setIsPlaying] = useState(false);
  const [mutedFiles, setMutedFiles] = useState<number[]>([]);
  const [volumes, setVolumes] = useState<Record<number, number>>({});
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
  const individualAudioRefs = useRef<Record<number, HTMLAudioElement>>({});
  const gainRefs = useRef<Record<number, GainNode>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);

  const audioFiles = files.filter(
    (file) => isAudioFile(file) && file.url
  );

  const documentCount = files.filter(
    (file) => !isAudioFile(file) && !file.urlYoutube
  ).length;

  const videoCount = files.filter((file) => file.urlYoutube).length;

  const trackData = {
    title: state?.morceauTitre ?? "Titre du morceau",
    ensemble: ensembleNom,
    ensembleId: currentEnsembleId,
  };

  const canDelete = (file: ExtendedFileItem) => {
    if (!user) return false;

    const role = user.ensembleRoles?.find(
      (r) => Number(r.ensembleId) === currentEnsembleId
    )?.role;

    return (
      role === "OWNER" ||
      role === "MODERATEUR" ||
      user.id === file.utilisateurId
    );
  };

  useEffect(() => {
    let active = true;

    const loadEnsemble = async () => {
      if (state?.ensembleNom) {
        setEnsembleNom(state.ensembleNom);
        return;
      }

      if (!token || !user) {
        setEnsembleNom("Ensemble");
        return;
      }

      try {
        const ensemble = await fetchEnsembleById(
          currentEnsembleId.toString(),
          user.id
        );

        if (active) setEnsembleNom(ensemble.nom);
      } catch {
        if (active) setEnsembleNom("Ensemble");
      }
    };

    loadEnsemble();

    return () => {
      active = false;
    };
  }, [currentEnsembleId, state?.ensembleNom, token, user]);

  useEffect(() => {
    if (!currentTrackId) {
      setLoading(false);
      setError("Identifiant du morceau invalide.");
      return;
    }

    let active = true;

    const loadFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        // const res = await axios.get(
        //   `${API_URL}/api/documents/morceau/${currentTrackId}`
        // );

        // if (!Array.isArray(res.data)) {
        //   throw new Error("Réponse API inattendue");
        // }

        // if (active) {
        //   setFiles(res.data.map(mapDocumentToFile));
        // }


        const documents = await getDocumentsByMorceau(currentTrackId);

        if (active) {
          setFiles(documents.map(mapDocumentToFile));
        }
      } catch {
        if (active) {
          setError("Impossible de récupérer les fichiers.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFiles();

    return () => {
      active = false;
    };
  }, [currentTrackId]);

  const stopAllAudio = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    Object.values(individualAudioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
    }

    audioRefs.current = {};
    gainRefs.current = {};
    audioCtxRef.current = null;

    setIsPlaying(false);
  };

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

      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }

      audioRefs.current = {};
      gainRefs.current = {};
      individualAudioRefs.current = {};
    };
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce fichier ?"
    );

    if (!confirmed || !user) return;

    try {
      // await axios.delete(`${API_URL}/api/documents/${id}`, {
      //   params: { userId: user.id },
      // });

      await deleteDocument(id, user.id);

      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success("Fichier supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleAddDocument = async (file: File) => {
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }

    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("type", "partition");
    // formData.append("format", file.name.split(".").pop() || "PDF");
    // formData.append("morceauId", currentTrackId.toString());
    // formData.append("utilisateurId", user.id.toString());

    try {
      setUploading(true);

      // const res = await axios.post(
      //   `${API_URL}/api/documents/upload`,
      //   formData
      // );

      // const newFile = mapDocumentToFile(res.data);
      const document = await uploadPartition(file, currentTrackId, user.id);
      const newFile = mapDocumentToFile(document);

      setFiles((prev) =>
        prev.some((item) => item.id === newFile.id)
          ? prev
          : [...prev, newFile]
      );

      toast.success("Partition ajoutée.");
    } catch {
      toast.error("Erreur lors de l'envoi de la partition.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddTutti = async (fileList: FileList) => {
    if (!user) {
      toast.error("Vous devez être connecté.");
      return;
    }

    const selectedFiles = Array.from(fileList);

    if (!selectedFiles.length) return;

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("type", "audio");
        formData.append(
          "format",
          file.name.split(".").pop() || "unknown"
        );
        formData.append("morceauId", currentTrackId.toString());
        formData.append("utilisateurId", user.id.toString());

        const res = await axios.post(
          `${API_URL}/api/documents/upload`,
          formData
        );

        const newFile = mapDocumentToFile(res.data);

        setFiles((prev) =>
          prev.some((item) => item.id === newFile.id)
            ? prev
            : [...prev, newFile]
        );
      }

      toast.success(
        `${selectedFiles.length} piste(s) audio ajoutée(s).`
      );
    } catch (err) {
      console.error("Erreur upload audio :", err);
      toast.error("Une erreur est survenue pendant l'envoi des pistes.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddYoutube = async () => {
    if (!user || !youtubeUrl.trim()) return;

    try {
      setUploading(true);

      const res = await axios.post(
        `${API_URL}/api/documents/upload/youtube`,
        {
          morceauId: currentTrackId,
          utilisateurId: user.id,
          urlYoutube: youtubeUrl.trim(),
        }
      );

      const newFile = mapDocumentToFile(res.data);

      setFiles((prev) => [...prev, newFile]);
      setYoutubeUrl("");
      toast.success("Lien YouTube ajouté.");
    } catch {
      toast.error("Erreur lors de l'ajout du lien YouTube.");
    } finally {
      setUploading(false);
    }
  };

  const handleVolumeChange = (fileId: number, value: number) => {
    setVolumes((prev) => ({ ...prev, [fileId]: value }));

    const gain = gainRefs.current[fileId];

    if (gain) {
      gain.gain.value = mutedFiles.includes(fileId)
        ? 0
        : value / 100;
    }

    const audio = individualAudioRefs.current[fileId];

    if (audio) {
      audio.volume = value / 100;
    }
  };

  const handleToggleMute = (fileId: number) => {
    const willMute = !mutedFiles.includes(fileId);

    const audio = individualAudioRefs.current[fileId];

    if (audio) audio.muted = willMute;

    const gain = gainRefs.current[fileId];

    if (gain) {
      gain.gain.value = willMute
        ? 0
        : (volumes[fileId] ?? 100) / 100;
    }

    setMutedFiles((prev) =>
      willMute
        ? [...prev, fileId]
        : prev.filter((id) => id !== fileId)
    );
  };

  const handlePlayTutti = async () => {
    if (!audioFiles.length) {
      toast.error("Aucune piste audio disponible.");
      return;
    }

    try {
      Object.values(individualAudioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      if (audioCtxRef.current) {
        await audioCtxRef.current.close();
      }

      audioRefs.current = {};
      gainRefs.current = {};

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      audioFiles.forEach((file) => {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = file.url!;

        audioRefs.current[file.id] = audio;

        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();

        gain.gain.value = mutedFiles.includes(file.id)
          ? 0
          : (volumes[file.id] ?? 100) / 100;

        source.connect(gain);
        gain.connect(ctx.destination);

        gainRefs.current[file.id] = gain;
      });

      await Promise.all(
        Object.values(audioRefs.current).map(
          (audio) =>
            new Promise<void>((resolve, reject) => {
              if (audio.readyState >= 3) {
                resolve();
                return;
              }

              const timeout = window.setTimeout(() => {
                reject(new Error("Délai de chargement dépassé."));
              }, 15000);

              audio.oncanplaythrough = () => {
                window.clearTimeout(timeout);
                resolve();
              };

              audio.onerror = () => {
                window.clearTimeout(timeout);
                reject(new Error("Impossible de charger une piste."));
              };

              audio.load();
            })
        )
      );

      await Promise.all(
        Object.values(audioRefs.current).map((audio) => audio.play())
      );

      setIsPlaying(true);
      toast.success("Tutti lancé !");
    } catch (err) {
      console.error("Erreur lecture Tutti :", err);
      stopAllAudio();
      toast.error("Impossible de lancer toutes les pistes audio.");
    }
  };

  const handleStopTutti = () => {
    stopAllAudio();
    toast.info("Lecture stoppée.");
  };

  return (
    <div className="track-details-container">
      <main className="td-page">
        <div className="td-topbar">
          <Link
            to={`/ensembles/${trackData.ensembleId}`}
            className="td-back-link"
          >
            <FaChevronLeft />
            Retour à l'ensemble
          </Link>

          <span className="td-topbar-label">
            ESPACE MUSICAL
          </span>
        </div>

        <section className="td-hero">
          <div className="td-hero-content">
            <div className="td-eyebrow">
              <span className="td-eyebrow-dot" />
              FICHE MORCEAU
            </div>

            <h1>{trackData.title}</h1>

            <p className="td-ensemble-name">
              <FaMusic />
              {trackData.ensemble}
            </p>

            <div className="td-hero-stats">
              <div className="td-stat">
                <strong>{files.length}</strong>
                <span>Fichiers</span>
              </div>
              <div className="td-stat">
                <strong>{audioFiles.length}</strong>
                <span>Pistes audio</span>
              </div>
              <div className="td-stat">
                <strong>{documentCount}</strong>
                <span>Partitions</span>
              </div>
              <div className="td-stat">
                <strong>{videoCount}</strong>
                <span>Vidéos</span>
              </div>
            </div>
          </div>

          <div className="td-hero-art">
            <div className="td-hero-disc">
              <div className="td-disc-center">
                <FaMusic />
              </div>
            </div>
            <span className="td-art-note td-note-one">♪</span>
            <span className="td-art-note td-note-two">♫</span>
          </div>
        </section>

        <section className="td-mixer-section">
          <div className="td-section-heading">
            <div>
              <span className="td-section-kicker">ÉCOUTE COLLECTIVE</span>
              <h2>
                <FaSlidersH />
                Console de mixage
              </h2>
              <p>
                Ajustez chaque pupitre et écoutez les pistes ensemble.
              </p>
            </div>

            <span className="td-live-badge">
              <span />
              {isPlaying ? "EN LECTURE" : "STUDIO"}
            </span>
          </div>

          <div className="td-player-panel">
            <div className="td-player-main">
              <div className="td-player-icon">
                <FaHeadphones />
              </div>

              <div className="td-player-copy">
                <span>LECTURE MULTIPISTE</span>
                <strong>Mode Tutti</strong>
                <small>
                  {audioFiles.length} piste(s) prête(s) à être mixée(s)
                </small>
              </div>
            </div>

            <div className="td-player-actions">
              <button
                className="td-play-button"
                onClick={handlePlayTutti}
                disabled={isPlaying || audioFiles.length === 0}
              >
                <FaPlay />
                Lancer le Tutti
              </button>

              <button
                className="td-stop-button"
                onClick={handleStopTutti}
                disabled={!isPlaying}
              >
                <FaStop />
                Arrêter
              </button>
            </div>

            {isPlaying && (
              <div className="td-playing-status">
                <span className="td-playing-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                Lecture des pistes en cours
              </div>
            )}
          </div>

          {loading ? (
            <div className="td-state-card">
              <div className="td-loader" />
              <strong>Chargement de votre espace musical…</strong>
              <span>Récupération des fichiers du morceau</span>
            </div>
          ) : error ? (
            <div className="td-state-card td-error-state">
              <strong>Une erreur est survenue</strong>
              <span>{error}</span>
            </div>
          ) : files.length === 0 ? (
            <div className="td-state-card">
              <div className="td-empty-icon">
                <FaMusic />
              </div>
              <strong>Aucun fichier pour le moment</strong>
              <span>
                Ajoutez une partition ou vos premières pistes audio.
              </span>
            </div>
          ) : (
            <div className="td-track-grid">
              {files.map((file, index) => {
                const audioFile = isAudioFile(file) && Boolean(file.url);
                const muted = mutedFiles.includes(file.id);
                const volume = volumes[file.id] ?? 100;

                return (
                  <article className="td-track-card" key={file.id}>
                    <div className="td-card-topline">
                      <span className="td-track-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`td-file-badge ${audioFile
                          ? "td-audio-badge"
                          : file.urlYoutube
                            ? "td-video-badge"
                            : "td-document-badge"
                          }`}
                      >
                        {audioFile
                          ? "AUDIO"
                          : file.urlYoutube
                            ? "YOUTUBE"
                            : "DOCUMENT"}
                      </span>
                    </div>

                    <FileItemComponent
                      file={file}
                      onDelete={
                        canDelete(file) ? handleDelete : undefined
                      }
                    />

                    <div className="td-card-meta">
                      {file.dateAjout && (
                        <span>
                          Ajouté le{" "}
                          {new Date(file.dateAjout).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      )}
                    </div>

                    {file.instruments && file.instruments.length > 0 && (
                      <div className="td-instruments">
                        {file.instruments.map((instrument) => (
                          <span
                            className="td-instrument-tag"
                            key={instrument.id}
                          >
                            {instrument.nom}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="td-card-divider" />

                    {audioFile && (
                      <div className="td-volume-section">
                        <div className="td-volume-heading">
                          <span>
                            {muted ? (
                              <FaVolumeMute />
                            ) : (
                              <FaVolumeUp />
                            )}
                            Niveau sonore
                          </span>
                          <strong>{volume}%</strong>
                        </div>

                        <input
                          className="td-volume-slider"
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          aria-label={`Volume de ${file.name}`}
                          onChange={(event) =>
                            handleVolumeChange(
                              file.id,
                              Number(event.target.value)
                            )
                          }
                        />

                        <button
                          className={`td-mute-button ${muted ? "is-muted" : ""
                            }`}
                          onClick={() => handleToggleMute(file.id)}
                        >
                          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                          {muted ? "Réactiver le son" : "Couper le son"}
                        </button>

                        <audio
                          className="td-audio-player"
                          ref={(element) => {
                            if (element) {
                              individualAudioRefs.current[file.id] = element;
                              element.volume = volume / 100;
                              element.muted = muted;
                            } else {
                              delete individualAudioRefs.current[file.id];
                            }
                          }}
                          controls
                          src={file.url}
                          onPlay={() => {
                            Object.values(audioRefs.current).forEach(
                              (audio) => audio.pause()
                            );

                            setIsPlaying(false);

                            Object.entries(
                              individualAudioRefs.current
                            ).forEach(([id, audio]) => {
                              if (Number(id) !== file.id) {
                                audio.pause();
                              }
                            });
                          }}
                        />
                      </div>
                    )}

                    {file.urlYoutube && (
                      <div className="td-youtube-player">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYoutubeId(
                            file.urlYoutube
                          )}`}
                          title={`Vidéo YouTube ${file.name}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {canDelete(file) && file.format !== "youtube" && (
                      <button
                        className="td-instrument-button"
                        onClick={() => setSelectedDocumentId(file.id)}
                      >
                        <FaPlus />
                        Associer un instrument
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="td-upload-section">
          <div className="td-section-heading">
            <div>
              <span className="td-section-kicker">GESTION DES RESSOURCES</span>
              <h2>
                <FaPlus />
                Ajouter des fichiers
              </h2>
              <p>
                Enrichissez la fiche du morceau avec vos ressources.
              </p>
            </div>

            {uploading && (
              <span className="td-uploading-label">
                Envoi en cours…
              </span>
            )}
          </div>

          <div className="td-upload-grid">
            <div className="td-upload-card">
              <div className="td-upload-icon td-upload-purple">
                <FaFileAlt />
              </div>
              <div className="td-upload-copy">
                <strong>Partition</strong>
                <span>PDF, Word ou ODT</span>
              </div>
              <label className="td-upload-button">
                <FaPlus />
                Ajouter
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.odt"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleAddDocument(file);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="td-upload-card">
              <div className="td-upload-icon td-upload-blue">
                <FaHeadphones />
              </div>
              <div className="td-upload-copy">
                <strong>Pistes audio</strong>
                <span>MP3, WAV ou OGG · Plusieurs fichiers</span>
              </div>
              <label className="td-upload-button">
                <FaPlus />
                Ajouter
                <input
                  type="file"
                  accept=".mp3,.wav,.ogg,audio/*"
                  multiple
                  disabled={uploading}
                  onChange={(event) => {
                    if (event.target.files) {
                      void handleAddTutti(event.target.files);
                    }
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <div className="td-youtube-add">
            <div className="td-youtube-add-icon">
              <FaYoutube />
            </div>

            <div className="td-youtube-add-copy">
              <strong>Ajouter une vidéo</strong>
              <span>Ajoutez un lien vers une vidéo de répétition ou de référence.</span>
            </div>

            <div className="td-youtube-input-group">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
              />
              <button
                onClick={() => void handleAddYoutube()}
                disabled={!youtubeUrl.trim() || uploading}
              >
                Ajouter le lien
              </button>
            </div>
          </div>
        </section>

        {selectedDocumentId !== null && (
          <AddInstrumentForm
            onSubmit={async (instrument) => {
              try {
                const res = await handleAddInstrumentSubmit(
                  selectedDocumentId,
                  instrument
                );

                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === selectedDocumentId
                      ? {
                        ...file,
                        instruments: res.instruments ?? [],
                      }
                      : file
                  )
                );

                toast.success("Instrument associé.");
                setSelectedDocumentId(null);
              } catch {
                toast.error("Erreur lors de l'association de l'instrument.");
              }
            }}
            onClose={() => setSelectedDocumentId(null)}
          />
        )}

        <footer className="td-footer">
          <span>ESPACE MUSICAL</span>
          <span>{trackData.ensemble} · {trackData.title}</span>
        </footer>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
