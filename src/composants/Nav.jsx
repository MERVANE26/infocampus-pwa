import { FaUser, FaNewspaper, FaCog } from 'react-icons/fa';
import './Nav.css'; // On va créer le CSS à part

function Nav({ activePage, onNavigate }) {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        {/* Logo INFOCAMPUS - non cliquable */}
        <div className="logo-section">
          <div className="logo-text">
            <div className="logo-main">INFOCAMPUS</div>
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="nav-center">
          <button 
            className={`nav-btn ${activePage === 'profil' ? 'active' : ''}`}
            onClick={() => onNavigate('profil')}
          >
            <FaUser />
            <span>Profil</span>
          </button>

          <button 
            className={`nav-btn ${activePage === 'publications' ? 'active' : ''}`}
            onClick={() => onNavigate('publications')}
          >
            <FaNewspaper />
            <span>Publications</span>
          </button>

          <button 
            className={`nav-btn ${activePage === 'parametres' ? 'active' : ''}`}
            onClick={() => onNavigate('parametres')}
          >
            <FaCog />
            <span>Paramètres</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;