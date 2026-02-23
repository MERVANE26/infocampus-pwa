import { FaTimes } from 'react-icons/fa';
import './BoutonFermer.css';

function BoutonFermer({ onClose, variant = 'modal' }) {
  return (
    <button 
      className={`close-btn ${variant}`}
      onClick={onClose}
      aria-label="Fermer"
    >
      <FaTimes />
    </button>
  );
}

export default BoutonFermer;