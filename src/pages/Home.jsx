import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaUserGraduate, 
    FaChalkboardTeacher, 
    FaUserTie,
    FaCheckCircle,
    FaUniversity,
    FaPen,
    FaLock,
    FaBuilding,
    FaPlusCircle
} from 'react-icons/fa';
import styles from './Home.module.css';


const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        // Animation pour les boutons principaux
        const handleMouseDown = (e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
        };

        const handleMouseUp = (e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
        };

        const handleMouseLeave = (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
        };

        const buttons = document.querySelectorAll(`.${styles.mainBtn}`);
        buttons.forEach(button => {
            button.addEventListener('mousedown', handleMouseDown);
            button.addEventListener('mouseup', handleMouseUp);
            button.addEventListener('mouseleave', handleMouseLeave);
        });

        // Cleanup
        return () => {
            buttons.forEach(button => {
                button.removeEventListener('mousedown', handleMouseDown);
                button.removeEventListener('mouseup', handleMouseUp);
                button.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    const handleCreateUniversity = () => {
        console.log('Navigation vers création université...');
        navigate('/create-university');
    };

    useEffect(() => {
      const checkToken = () => {
          const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (token || user) {
            navigate('/profile');
        }
    }
    checkToken();
    },[]);

    return (
        <div className={styles.container}>
            <div className={styles.homeCard}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                    <div className={styles.universityIcon}>
                        <FaUniversity />
                    </div>
                    <div className={styles.logoText}>INFOcAMPUS</div>
                    <div className={styles.logoSubtitle}>CONNECTING UNIVERSITIES</div>
                </div>

                <div className={styles.tagline}>
                    La plateforme de communication intelligente<br />pour les universités africaines
                </div>

                {/* Actions principales */}
                <div className={styles.mainActions}>
                    <Link to="/register" className={`${styles.mainBtn} ${styles.btnSignup}`}>
                        <span className={styles.btnIcon}>
                            <FaPen />
                        </span>
                        S'inscrire
                    </Link>
                    
                    <Link to="/connexion" className={`${styles.mainBtn} ${styles.btnLogin}`}>
                        <span className={styles.btnIcon}>
                            <FaLock />
                        </span>
                        Se connecter
                    </Link>
                </div>

                {/* Créer une université */}
                <div className={styles.createUniversity}>
                    <button 
                        onClick={handleCreateUniversity}
                        className={styles.createUniversityBtn}
                    >
                        <span className={styles.createUniversityIcon}>
                            <FaPlusCircle />
                        </span>
                        <span className={styles.createUniversityText}>
                            Créer une université
                        </span>
                    </button>
                    <div className={styles.createUniversitySub}>
                        Inscrivez votre établissement sur InfoCAMPUS
                    </div>
                </div>

                {/* Features */}
                <div className={styles.features}>
                    <div className={styles.featuresTitle}>✨ Pourquoi InfoCAMPUS ?</div>
                    <div className={styles.featureItem}>
                        <span className={styles.check}>
                            <FaCheckCircle />
                        </span>
                        Communications ciblées et intelligentes
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.check}>
                            <FaCheckCircle />
                        </span>
                        Interface simple et professionnelle
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.check}>
                            <FaCheckCircle />
                        </span>
                        Pensé pour les universités africaines
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    Une solution made in Africa 🌍
                </div>
            </div>
        </div>
    );
};

export default Home;