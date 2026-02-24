import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './BoutonCommentaire.css';

function BoutonCommentaire({ type, count, isActive, onClick }) {
  const config = {
    like: {
      icon: FaThumbsUp,
      activeClass: 'active-like'
    },
    dislike: {
      icon: FaThumbsDown,
      activeClass: 'active-dislike'
    }
  };

  const { icon: Icon, activeClass } = config[type];

  return (
    <button 
      className={`comment-action ${isActive ? activeClass : ''}`}
      onClick={onClick}
    >
      <Icon />
      <span>{count}</span>
    </button>
  );
}

export default BoutonCommentaire;