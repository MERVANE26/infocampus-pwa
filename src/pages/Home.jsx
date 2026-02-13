import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaUserGraduate, 
    FaChalkboardTeacher, 
    FaUserTie,
    FaCheckCircle,
    FaUniversity,
    FaPen,
    FaLock
} from 'react-icons/fa';
import styles from './Home.module.css';

const Home = () => {
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

    const handleUserTypeClick = (type) => {
        console.log(`Navigation vers le formulaire ${type}...`);
        // Naviguer vers le formulaire spécifique avec le type d'utilisateur
        navigate(`/inscription?type=${type}`);
    };

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
                    <Link to="/inscription" className={`${styles.mainBtn} ${styles.btnSignup}`}>
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

                {/* Types d'utilisateurs */}
                <div className={styles.userTypes}>
                    <div className={styles.userTypesTitle}>
                        Vous êtes ?
                    </div>
                    <div className={styles.userTypesGrid}>
                        <button 
                            onClick={() => handleUserTypeClick('etudiant')}
                            className={styles.userTypeItem}
                        >
                            <span className={`${styles.userTypeIcon} ${styles.studentIcon}`}>
                                <FaUserGraduate />
                            </span>
                            <span className={styles.userTypeLabel}>Étudiant</span>
                        </button>

                        <button 
                            onClick={() => handleUserTypeClick('enseignant')}
                            className={styles.userTypeItem}
                        >
                            <span className={`${styles.userTypeIcon} ${styles.teacherIcon}`}>
                                <FaChalkboardTeacher />
                            </span>
                            <span className={styles.userTypeLabel}>Enseignant</span>
                        </button>

                        <button 
                            onClick={() => handleUserTypeClick('admin')}
                            className={styles.userTypeItem}
                        >
                            <span className={`${styles.userTypeIcon} ${styles.adminIcon}`}>
                                <FaUserTie />
                            </span>
                            <span className={styles.userTypeLabel}>Admin</span>
                        </button>
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