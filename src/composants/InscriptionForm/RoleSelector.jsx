import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';
import styles from './RoleSelector.module.css';

const RoleSelector = ({ role, onRoleChange }) => {
    const { t } = useTranslation();
    const roles = [
        { id: 'student', label: t('auth.student'), icon: FaUserGraduate, emoji: '🎒' },
        { id: 'teacher', label: t('auth.teacher'), icon: FaChalkboardTeacher, emoji: '👨‍🏫' },
        { id: 'admin', label: t('auth.admin'), icon: FaUserTie, emoji: '👔' }
    ];

    return (
        <div className={styles.roleSection}>
            <h2 className={styles.sectionTitle}>
                🎯 {t('auth.youAre')}
            </h2>
            <div className={styles.roleOptions}>
                {roles.map(r => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    
                    return (
                        <button
                            key={r.id}
                            type="button"
                            className={`${styles.roleOption} ${isSelected ? styles.selected : ''}`}
                            onClick={() => onRoleChange(r.id)}
                        >
                            <span className={styles.emoji}>{r.emoji}</span>
                            <Icon className={styles.roleIcon} />
                            <span className={styles.roleLabel}>{r.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RoleSelector;