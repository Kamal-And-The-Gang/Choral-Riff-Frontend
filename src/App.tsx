import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Inscription } from './pages/Inscription';
import { Connexion } from './pages/Connexion';
import { Ensembles } from './pages/Ensembles';
import { EnsemblesPage } from './pages/EnsemblesPages';
import { EnsembleDetails } from './pages/EnsembleDetails';
import { AddEnsemble } from './pages/AddEnsemble';
import { AddScore } from './pages/AddScore';
import { TrackDetails } from './pages/TrackDetails';


export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/ensembles" element={<Ensembles />} />
        <Route path="/ensemblesPages" element={<EnsemblesPage />} />
        <Route path="/ensembleDetails" element={<EnsembleDetails />} />
        <Route path="/ensembles/:ensembleId" element={<EnsembleDetails />} />
        <Route path="/addEnsemble" element={<AddEnsemble />} />
        <Route path="/ajouter-ensemble" element={<AddEnsemble />} />
        <Route path="/ensembles/:ensembleId/ajouter-fichier" element={<AddScore />} />
        <Route path="/ensembles/:ensembleId/morceaux/:trackId" element={<TrackDetails />}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;