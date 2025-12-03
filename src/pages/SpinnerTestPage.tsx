// src/components/SpinnerTestPage.tsx (ou un nom similaire)

import React from 'react';
// ASSUREZ-VOUS QUE CE CHEMIN EST CORRECT PAR RAPPORT À L'EMPLACEMENT DE CE NOUVEAU FICHIER !
import Spinner from './Spinner'; 

const SpinnerTestPage: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Page de Test du Spinner</h1>
      <p>Ci-dessous, trois exemples de chargement :</p>
      
      {/* Exemple 1: Spinner standard */}
      <div style={{ margin: '30px', border: '1px solid #ddd', padding: '20px' }}>
        <h2>Chargement Standard</h2>
        <Spinner />
      </div>

      {/* Exemple 2: Spinner avec message personnalisé */}
      <div style={{ margin: '30px', border: '1px solid #ddd', padding: '20px' }}>
        <h2>Chargement Personnalisé</h2>
        <Spinner message="Veuillez patienter pendant l'importation..." />
      </div>

      {/* Exemple 3: Spinner de couleur différente (si votre CSS le permet) */}
      <div style={{ margin: '30px', border: '1px solid #ddd', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h2>Chargement sur Fond Clair</h2>
        <Spinner message="Test de visibilité..." />
      </div>
      
    </div>
  );
};

export default SpinnerTestPage;