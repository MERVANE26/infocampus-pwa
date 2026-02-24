import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';
import styles from './RoleSelector.module.css';

const RoleSelector = ({ role, onRoleChange }) => {
    const roles = [
        { id: 'student', label: 'Étudiant', icon: FaUserGraduate, emoji: '🎒' },
        { id: 'teacher', label: 'Enseignant', icon: FaChalkboardTeacher, emoji: '👨‍🏫' },
        { id: 'admin', label: 'Admin', icon: FaUserTie, emoji: '👔' }
    ];

    return (
        <div className={styles.roleSection}>
            <h2 className={styles.sectionTitle}>
                🎯 Vous êtes
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