import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// ============================================
// IMPORT DE TES COMPOSANTS
// ============================================
import Home from './pages/Home';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Publication from './pages/Publication';
import FairePublication from './pages/FairePublication';
import ProfilEtudiant from './pages/ProfilEtudiant';
import ProfilEnseignant from './pages/ProfilEnseignant';
import ProfilAdministration from './pages/ProfilAdministration';
import CreationUniversite from './pages/CreationUniversite';
import ValidationCode from './pages/ValidationCode';
// ============================================
// COMPOSANT DE PROTECTION DES ROUTES
// ============================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// ============================================
// COMPOSANT DE REDIRECTION SELON LE RÔLE
// ============================================
const RoleBasedProfil = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  switch(user.role) {
    case 'Étudiant':
    case 'Étudiante':
      return <ProfilEtudiant />;
    case 'Enseignant':
      return <ProfilEnseignant />;
    case 'Administrateur':
    case 'Administration':
      return <ProfilAdministration />;
    default:
      return <Navigate to="/profil-etudiant" />;
  }
};

// ============================================
// COMPOSANT PRINCIPAL APP
// ============================================
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ========================================
              ROUTES PUBLIQUES (accessibles sans connexion)
              ======================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/creer-universite" element={<CreationUniversite />} />
          <Route path="/validation-code" element={<ValidationCode />} />
          {/* ========================================
              ROUTES PROTÉGÉES (nécessitent une connexion)
              ======================================== */}
          
          {/* Publications */}
          <Route 
            path="/publications" 
            element={
              // <PrivateRoute>
                <Publication />
              // </PrivateRoute>
            } 
          />
          
          {/* Création de publication */}
          <Route 
            path="/faire-publication" 
            element={
              // <PrivateRoute>
                <FairePublication />
              // </PrivateRoute>
            } 
          />
          
          {/* Routes de profil - version générique */}
          <Route 
            path="/profil" 
            element={
              // <PrivateRoute>
                <RoleBasedProfil />
              // </PrivateRoute>
            } 
          />
          
          {/* Routes de profil - versions spécifiques */}
          <Route 
            path="/profil-etudiant" 
            element={
              // <PrivateRoute>
                <ProfilEtudiant />
              // </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profil-enseignant" 
            element={
              // <PrivateRoute>
                <ProfilEnseignant />
              // </PrivateRoute>
            } 
          />
          <Route 
            path="/profil-administration" 
            element={
              // <PrivateRoute>
                <ProfilAdministration />
              // </PrivateRoute>
            } 
          />
          
          <Route 
            path="/creation-université" 
            element={
              <PrivateRoute>
                <CreationUniversite />
              </PrivateRoute>
            } 
          />
          
          {/* ========================================
              REDIRECTION 404 - Page non trouvée
              ======================================== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;