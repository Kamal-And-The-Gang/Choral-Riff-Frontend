// import "./index.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { HomePage } from "./pages/HomePage";
// import { Inscription } from "./pages/Inscription";
// import { Connexion } from "./pages/Connexion";
// import { EnsemblesPage } from "./pages/EnsemblesPages";
// import { EnsembleDetails } from "./pages/EnsembleDetails";
// import { AddEnsemble } from "./pages/AddEnsemble";
// import { AddMorceau } from "./pages/AddMorceau";
// import { TrackDetails } from "./pages/TrackDetails/TrackDetails";
// import { Dashboard } from "./pages/Dashboard";
// import { MembersList } from "./pages/MembersList";
// import { Footer } from "./components/Footer";
// import { Header } from "./components/Header";
// import { NotificationProvider } from './contexts/NotificationContext';
// import NotificationPage from './pages/NotificationPage';
// import { InvitationAcceptPage } from "./pages/InvitationAcceptPage";
// import SpinnerTestPage from "./pages/SpinnerTestPage";

// import { Invitation } from "./pages/Invitation";

// export const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <NotificationProvider>
//       <Header />
//         <main className="app-content">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/inscription" element={<Inscription />} />
//             <Route path="/connexion" element={<Connexion />} />
//             <Route path="/ensembles" element={<EnsemblesPage />} />
//             <Route path="/ensembleDetails" element={<EnsembleDetails />} />
//             <Route path="/addEnsemble" element={<AddEnsemble />} />
//             <Route path="/ajouter-ensemble" element={<AddEnsemble />} />
//             <Route
//               path="/ensembles/:ensembleId/invitations"
//               element={<Invitation />}
//             />
//             <Route path="/test-spinner" element={<SpinnerTestPage />} />

//             <Route
//               path="/ensembles/:ensembleId/ajouter-fichier"
//               element={<AddMorceau />}
//             />
//             <Route
//               path="/ensembles/:ensembleId/morceaux/:trackId"
//               element={<TrackDetails />}
//             />
//             <Route path="/notifications" element={<NotificationPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/mon-espace" element={<Dashboard />} />
            
//           <Route
//               path="/ensembles/:ensembleId/membres"
//               element={<MembersList />}
//             />
//             {/* <Route path="/invitation" element={<Invitation />} /> */}
//             <Route
//               path="/invitations/accept"
//               element={<InvitationAcceptPage />}
//             />
//             <Route
//               path="/ensembles/:ensembleId/members"
//               element={<MembersList />}
//             />
//           </Routes>
//           <Routes>
//             {/* Détail d'un ensemble */}
//             <Route
//               path="/ensembles/:ensembleId"
//               element={<EnsembleDetails />}
//             />

//             {/* Modifier ou créer un ensemble */}
//             <Route
//               path="/ensembles/:ensembleId/edit"
//               element={<AddEnsemble />}
//             />
//             <Route path="/ensembles/add" element={<AddEnsemble />} />
//           </Routes>
//         </main>
//         <Footer />
//         </NotificationProvider>
//     </div>
//     </BrowserRouter>
//   );
// };

// export default App;
import React from 'react';
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Inscription } from "./pages/Inscription";
import { Connexion } from "./pages/Connexion";
import { EnsemblesPage } from "./pages/EnsemblesPages";
import { EnsembleDetails } from "./pages/EnsembleDetails";
import { AddEnsemble } from "./pages/AddEnsemble";
import { AddMorceau } from "./pages/AddMorceau";
import { TrackDetails } from "./pages/TrackDetails/TrackDetails";
import { Dashboard } from "./pages/Dashboard";
import { MembersList } from "./pages/MembersList";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationPage from './pages/NotificationPage';
import { InvitationAcceptPage } from "./pages/InvitationAcceptPage";
import SpinnerTestPage from "./pages/SpinnerTestPage";
import { Invitation } from "./pages/Invitation";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NotificationProvider>
          <Header />
          <main className="app-content">
            <Routes>
              {/* Routes générales */}
              <Route path="/" element={<HomePage />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/ensembles" element={<EnsemblesPage />} />
              <Route path="/ensembleDetails" element={<EnsembleDetails />} />
              <Route path="/addEnsemble" element={<AddEnsemble />} />
              <Route path="/ajouter-ensemble" element={<AddEnsemble />} />
              <Route path="/test-spinner" element={<SpinnerTestPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mon-espace" element={<Dashboard />} />

              {/* Routes pour l'invitation et les fichiers */}
              <Route path="/ensembles/:ensembleId/invitations" element={<Invitation />} />
              <Route path="/ensembles/:ensembleId/ajouter-fichier" element={<AddMorceau />} />
              <Route path="/ensembles/:ensembleId/morceaux/:trackId" element={<TrackDetails />} />
              
              {/* Notifications */}
              <Route path="/notifications" element={<NotificationPage />} />
              
              {/* Routes pour les membres */}
              <Route path="/ensembles/:ensembleId/membres" element={<MembersList />} />
              <Route path="/ensembles/:ensembleId/members" element={<MembersList />} />

              {/* Page d'acceptation de l'invitation */}
              <Route path="/invitations/accept" element={<InvitationAcceptPage />} />

              {/* Détail et édition d'un ensemble */}
              <Route path="/ensembles/:ensembleId" element={<EnsembleDetails />} />
              <Route path="/ensembles/:ensembleId/edit" element={<AddEnsemble />} />
              <Route path="/ensembles/add" element={<AddEnsemble />} />
            </Routes>
          </main>
          <Footer />
        </NotificationProvider>
      </div>
    </BrowserRouter>
  );
};

export default App;
