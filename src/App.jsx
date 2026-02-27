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
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import About from './pages/About';
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

  switch(user.roles[0]) {
    case 'student':
    case 'Étudiante':
      return <ProfilEtudiant />;
    case 'teacher':
      return <ProfilEnseignant />;
    case 'admin':
    case 'Administration':
      return <ProfilAdministration />;
    default:
      return <Navigate to="/profile" />;
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
          <Route path="/login" element={<Connexion />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/create-university" element={<CreationUniversite />} />
          <Route path="/otp-validation" element={<ValidationCode />} />
          {/* ========================================
              ROUTES PROTÉGÉES (nécessitent une connexion)
              ======================================== */}
          
          {/* Publications */}
          <Route 
            path="/publications" 
            element={
              <PrivateRoute>
                <Publication />
              </PrivateRoute>
            } 
          />
          
          {/* Création de publication */}
          <Route 
            path="/faire-publication" 
            element={
              <PrivateRoute>
                <FairePublication />
              </PrivateRoute>
            } 
          />
          
          {/* Routes de profil - version générique */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <RoleBasedProfil />
              </PrivateRoute>
            } 
          />
          
          {/* Routes de profil - versions spécifiques */}
          <Route 
            path="/profil-etudiant" 
            element={
              <PrivateRoute>
                <ProfilEtudiant />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profil-enseignant" 
            element={
              <PrivateRoute>
                <ProfilEnseignant />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profil-administration" 
            element={
              <PrivateRoute>
                <ProfilAdministration />
              </PrivateRoute>
            } 
          />
          
          {/* <Route 
            path="/create-university" 
            element={
              <PrivateRoute>
                <CreationUniversite />
              </PrivateRoute>
            } 
          /> */}

           <Route 
            path="/terms" 
            element={
              // <PrivateRoute>
                <Terms />
              // </PrivateRoute>
            } 
          />

           <Route 
            path="/privacy" 
            element={
              // <PrivateRoute>
                <Privacy/>
              // </PrivateRoute>
            } 
          />

           <Route 
            path="/legal" 
            element={
              // <PrivateRoute>
                <Legal/>
              // </PrivateRoute>
            } 
          />

           <Route 
            path="/about" 
            element={
              // <PrivateRoute>
                <About/>
              // </PrivateRoute>
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