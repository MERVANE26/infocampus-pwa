import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';

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
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import AccessDenied from './pages/AccessDenied';
import { api } from './lib/api';
import GetStarted from './pages/GetStarted';

// ============================================
// COMPOSANT DE PROTECTION DES ROUTES
// ============================================
const PrivateRoute = ({ children }) => {
  // This component guards access to routes by checking for a valid token and user
  // stored in localStorage. The original development override (commented below)
  // can be temporarily re-enabled if you need to bypass auth while working on
  // UI or routing. Make sure to remove or recomment it before pushing changes.
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  /*
  // DEVELOPMENT: allow access to all routes without authentication.
  // To disable the guard during development, uncomment the block above and
  // comment out the real checks. e.g.: 
  // if (!token || !user) return <Navigate to="/login" />;
  */
  return children;
};

// ============================================
// COMPOSANT DE REDIRECTION SELON LE RÔLE
// ============================================
const RoleBasedProfil = ({ universities }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.status) {
    case 'student':
    case 'Étudiante':
      return <ProfilEtudiant universities={universities} />;
    case 'teacher':
      return <ProfilEnseignant universities={universities} />;
    case 'admin':
    case 'Administration':
      return <ProfilAdministration universities={universities} />;
    default:
      return <Navigate to="/profile" />;
  }
};

const CheckUserAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (token || user) {
    return <Navigate to="/posts" />;
  }
  return children;
}

// ============================================
// COMPOSANT DE PROTECTION BASÉE SUR LE RÔLE
// ============================================
const RoleRestrictedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const [user, setUser] = useState(userStr ? JSON.parse(userStr) : null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data.user);
        console.log('User info fetched for role check:', response.data.user);
      } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur :', err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);



  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  const userRoles = user.roles || [];
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return children;
};

// ============================================
// COMPOSANT PRINCIPAL APP
// ============================================
function App() {


  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await api.get('/universities/list');
        setUniversities(response.data.universities);
      } catch (err) {
        console.error('Erreur lors du chargement des universités :', err);
      }
    };

    fetchUniversities();
  }, []);


  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ========================================
                ROUTES PUBLIQUES (accessibles sans connexion)
                ======================================== */}
            <Route path="/" element={
              // <CheckUserAuth>
                <Home />
              // </CheckUserAuth>
            } />

            <Route path="/login" element={
              <CheckUserAuth>
                <Connexion />
              </CheckUserAuth>
            } />
            <Route path="/register" element={
              <CheckUserAuth>
                <Inscription />
              </CheckUserAuth>
            } />
            <Route path="/create-university" element={
              <CheckUserAuth>
                <CreationUniversite />
              </CheckUserAuth>
            } />
            <Route path="/otp-validation" element={
              <CheckUserAuth>
                <ValidationCode />
              </CheckUserAuth>
            } />

            <Route path="/get-started" element={
              <CheckUserAuth>
                <GetStarted />
              </CheckUserAuth>
            } />

            {/* ========================================
                ROUTES PROTÉGÉES (nécessitent une connexion)
                ======================================== */}

            {/* Publications - Restricted to Teachers and Admins */}
            <Route
              path="/posts"
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
                <RoleRestrictedRoute allowedRoles={['teacher', 'admin']}>
                  <FairePublication />
                </RoleRestrictedRoute>
              }
            />

            {/* Routes de profil - version générique */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <RoleBasedProfil universities={universities} />
                </PrivateRoute>
              }
            />

            {/* Routes de profil - versions spécifiques */}
            <Route
              path="/profil-etudiant"
              element={
                <PrivateRoute>
                  <ProfilEtudiant universities={universities} />
                </PrivateRoute>
              }
            />

            <Route
              path="/profil-enseignant"
              element={
                <PrivateRoute>
                  <ProfilEnseignant universities={universities} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profil-administration"
              element={
                <PrivateRoute>
                  <ProfilAdministration universities={universities} />
                </PrivateRoute>
              }
            />

            <Route
              path="/terms"
              element={<Terms />}
            />

            <Route
              path="/privacy"
              element={<Privacy />}
            />

            <Route
              path="/legal"
              element={<Legal />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            {/* ========================================
                404 - Page non trouvée
                ======================================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;