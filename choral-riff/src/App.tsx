import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Inscription } from './pages/Inscription';
import { Connexion } from './pages/Connexion';
import { Ensembles } from './pages/Ensembles';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/ensembles" element={<Ensembles />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;