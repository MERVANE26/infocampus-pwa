import { FaCamera, FaNewspaper, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './BoutonProfil.css';

function BoutonProfil({ action, onClick }) {
  const config = {
    photo: {
      icon: FaCamera,
      label: '',
      className: 'camera-btn',
      title: 'Changer la photo'
    },
    publication: {
      icon: FaNewspaper,
      label: 'Faire une publication',
      className: 'btn-success'
    },
    modifier: {
      icon: FaCog,
      label: 'Modifier mes informations',
      className: 'btn-secondary'
    },
    deconnexion: {
      icon: FaSignOutAlt,
      label: 'Déconnexion',
      className: 'btn-secondary logout'
    }
  };

  const { icon: Icon, label, className, title } = config[action];

  return (
    <button 
      className={`action-btn ${className}`}
      onClick={onClick}
      title={title}
    >
      <Icon />
      {label && <span>{label}</span>}
    </button>
  );
}

export default BoutonProfil;