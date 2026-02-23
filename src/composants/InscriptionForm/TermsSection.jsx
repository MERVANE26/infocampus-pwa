import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import styles from './TermsSection.module.css';

const TermsSection = ({ checked, onChange }) => {
    return (
        <div className={styles.termsContainer}>
            <div className={styles.checkboxWrapper}>
                <input
                    type="checkbox"
                    id="terms"
                    checked={checked}
                    onChange={onChange}
                    required
                />
                <label htmlFor="terms" className={styles.checkboxLabel}>
                    J'accepte les conditions <span className={styles.required}>*</span>
                </label>
            </div>

            <div className={styles.legalLinks}>
                <Link to="/conditions" target="_blank" className={styles.link}>
                    <FaFileContract /> Conditions d'utilisation
                </Link>
                <span className={styles.separator}>|</span>
                <Link to="/confidentialite" target="_blank" className={styles.link}>
                    <FaShieldAlt /> Politique de confidentialité
                </Link>
                <span className={styles.separator}>|</span>
                <Link to="/charte-donnees" target="_blank" className={styles.link}>
                    <FaDatabase /> Charte des données
                </Link>
            </div>

            <div className={styles.note}>
                <FaFileContract />
                En cliquant sur "Recevoir le code", vous acceptez nos conditions
            </div>
        </div>
    );
};

export default TermsSection;