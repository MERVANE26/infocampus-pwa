import { FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import './BoutonAction.css';

function BoutonAction({ type, count, isActive, onClick }) {
  const config = {
    like: {
      icon: FaThumbsUp,
      label: 'J\'aime',
      activeClass: 'active-like'
    },
    dislike: {
      icon: FaThumbsDown,
      label: 'Je n\'aime pas',
      activeClass: 'active-dislike'
    },
    comment: {
      icon: FaComment,
      label: 'Commenter',
      activeClass: ''
    }
  };

  const { icon: Icon, label, activeClass } = config[type];

  return (
    <button 
      className={`action-btn ${isActive ? activeClass : ''}`}
      onClick={onClick}
    >
      <Icon />
      <span>{label}</span>
      {count > 0 && <span className="count">({count})</span>}
    </button>
  );
}

export default BoutonAction;