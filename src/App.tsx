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
import { TrackDetails } from './pages/TrackDetails/TrackDetails';
import { Dashboard } from './pages/Dashboard';
import { MembersList } from './pages/MembersList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App = () => {
  return (
    <>
      <Header />
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
          <Route path="/ensembles/:ensembleId/morceaux/:trackId" element={<TrackDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mon-espace" element={<Dashboard />} />
          <Route path="/ensembles/:ensembleId/membres" element={<MembersList />} />

        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;