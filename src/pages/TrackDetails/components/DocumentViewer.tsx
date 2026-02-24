import React from 'react';
import type { ExtendedFileItem } from '../TrackDetails.tsx';

interface ViewerProps {
  file: ExtendedFileItem;
}

const DocumentViewer: React.FC<ViewerProps> = ({ file }) => {
  const extension = file.format.toLowerCase();

  return (
    <div className="viewer-container" style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
      <h3 style={{ color: 'var(--primary-color)' }}>Aperçu : {file.name}</h3>
      
      {/* Rendu selon le format */}
      {['mp3', 'wav'].includes(extension) || file.type === 'audio' ? (
        <audio controls src={file.url} style={{ width: '100%', marginTop: '10px' }}>
          Votre navigateur ne supporte pas l'audio.
        </audio>
      ) : extension === 'pdf' ? (
        <embed src={file.url} type="application/pdf" width="100%" height="600px" style={{ borderRadius: '8px' }} />
      ) : ['jpg', 'jpeg', 'png'].includes(extension) ? (
        <img src={file.url} alt={file.name} style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)' }} />
      ) : (
        <div className="no-preview">
          <p>Aperçu indisponible pour ce format ({extension}).</p>
          <a href={file.url} download className="download-button">Télécharger le fichier</a>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;