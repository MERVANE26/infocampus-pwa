import { FaDownload, FaFilePdf, FaFileImage, FaFile } from 'react-icons/fa';
import './BoutonTelecharger.css';

function BoutonTelecharger({ fileName, fileSize, fileUrl, fileType }) {
  
  const getIcon = () => {
    if (fileType === 'pdf') return FaFilePdf;
    if (fileType === 'image') return FaFileImage;
    return FaFile;
  };

  const Icon = getIcon();

  const handleDownload = () => {
    // Logique de téléchargement
    window.open(fileUrl, '_blank');
    // Ici tu peux ajouter le tracking
    console.log(`Téléchargement: ${fileName}`);
  };

  return (
    <div className="attachment-item">
      <div className={`attachment-icon ${fileType}-icon`}>
        <Icon />
      </div>
      <div className="attachment-info">
        <div className="attachment-name">{fileName}</div>
        <div className="attachment-meta">
          <span className="attachment-size">📏 {fileSize}</span>
          <span>• {fileType.toUpperCase()}</span>
        </div>
      </div>
      <button className="attachment-download" onClick={handleDownload}>
        <FaDownload />
        <span>Télécharger</span>
      </button>
    </div>
  );
}

export default BoutonTelecharger;