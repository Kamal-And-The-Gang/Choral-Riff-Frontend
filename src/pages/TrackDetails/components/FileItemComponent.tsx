import { FaDownload, FaFilePdf, FaHeadphones, FaPlayCircle } from "react-icons/fa";

import styles from "./FileItemComponent.module.css";

// --- TYPESCRIPT TYPES ---
export type FileItem = {
    id: number;
    name: string;
    type: 'partition' | 'audio';
    format: string;
    size: string;
    role: string;
};

const FileItemComponent = ({ file }: { file: FileItem }) => {
    const isPartition = file.type === 'partition';
    const Icon = isPartition ? FaFilePdf : FaHeadphones;

    const handleActionClick = () => {
        alert(`Action lancée pour le fichier : "${file.name}"`);
        // Ici, un visualiseur ou un lecteur audio
    };

    return (
        <div className={`${ styles.fileItem } ${file.type}Item`}>
            <div className={ styles.fileMainInfo }>
                <Icon size={20} className={ styles.fileIcon } />
                <div className={ styles.fileDetailsText }>
                    <span className={ styles.fileName }>{file.name}</span>
                    <span className={ styles.fileRole }>Rôle : {file.role}</span>
                </div>
            </div>

            <div className={ styles.fileActions }>
                <span className={ styles.fileFormatSize }>{file.format} ({file.size})</span>

                <button
                    onClick={handleActionClick}
                    className={ styles.actionButton }
                    title={isPartition ? "Visualiser la partition" : "Écouter la piste"}
                >
                    <FaPlayCircle size={14} />
                </button>

                <button
                    onClick={() => alert(`Téléchargement de ${file.name}`)}
                    className= { styles.actionButton}
                    title="Télécharger">
                    <FaDownload size={14} />
                </button>
            </div>
        </div>
    );
};

export default FileItemComponent;