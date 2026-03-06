import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFileContract, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import styles from './TermsSection.module.css';

const TermsSection = ({ checked, onChange }) => {
    const { t } = useTranslation();

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
                    {t('auth.agreeToTerms')} <span className={styles.required}>*</span>
                </label>
            </div>

            <div className={styles.legalLinks}>
                <Link to="/terms" target="_blank" className={styles.link}>
                    <FaFileContract /> {t('auth.termsLink')}
                </Link>
                <span className={styles.separator}>|</span>
                <Link to="/privacy" target="_blank" className={styles.link}>
                    <FaShieldAlt /> {t('auth.privacyLink')}
                </Link>
                <span className={styles.separator}>|</span>
                <Link to="/legal" target="_blank" className={styles.link}>
                    <FaDatabase /> {t('auth.dataPolicyLink')}
                </Link>
            </div>

            <div className={styles.note}>
                <FaFileContract />
                {t('auth.termsConfirmation')}
            </div>
        </div>
    );
};

export default TermsSection;