import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './InfoBox.module.css';

const InfoBox = ({ title, children }) => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.infoHeader}>
                <FaInfoCircle className={styles.infoIcon} />
                <strong>{title}</strong>
            </div>
            <div className={styles.infoContent}>
                {children}
            </div>
        </div>
    );
};

export default InfoBox;