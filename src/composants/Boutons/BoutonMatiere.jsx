import { FaPlus, FaTimes } from 'react-icons/fa';
import './BoutonMatiere.css';

function BoutonMatiere({ type, subject, onAction }) {
  if (type === 'add') {
    return (
      <button className="add-subject" onClick={onAction}>
        <FaPlus />
        Ajouter une matière
      </button>
    );
  }

  if (type === 'subject') {
    return (
      <span className="subject-tag" onClick={onAction}>
        {subject} <FaTimes className="remove-icon" />
      </span>
    );
  }

  return null;
}

export default BoutonMatiere;