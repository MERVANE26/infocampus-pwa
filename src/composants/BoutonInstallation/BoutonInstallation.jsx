import React, { useState, useEffect } from 'react';
import { FaDownload, FaMobile } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import styles from './BoutonInstallation.module.css';

const BoutonInstallation = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Vérifier si l'app est déjà installée
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Capturer l'événement beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Vérifier si l'app a été installée
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowButton(false);
            setInstallPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        // Afficher la boîte de dialogue d'installation
        installPrompt.prompt();

        // Attendre la réponse
        const { outcome } = await installPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ Application installée avec succès');
        } else {
            console.log('❌ Installation annulée');
        }

        // Réinitialiser
        setInstallPrompt(null);
        setShowButton(false);
    };

    if (!showButton || isInstalled) return null;

    return (
        <Button
            variant="success"
            className={styles.installButton}
            onClick={handleInstallClick}
        >
            <FaDownload className={styles.icon} />
            <span className={styles.text}>Installer l'application</span>
            <FaMobile className={styles.icon} />
        </Button>
    );
};

export default BoutonInstallation;