import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserTie, FaUniversity, FaBuilding, FaBriefcase, FaBook } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import styles from './AdminFields.module.css';

const AdminFields = ({ formData, onChange, onToggleTeacher, universities }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.adminFields}>
            <h2 className={styles.sectionTitle}>
                <FaUserTie /> {t('auth.administration')}
            </h2>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaUniversity /> {t('auth.university')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="admin.university"
                    value={formData.university}
                    onChange={onChange}
                    required
                    className={styles.select}
                >
                    <option value="">{t('auth.select')}</option>
                    {universities.map(u => (

                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBuilding /> {t('auth.adminService')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="admin.service"
                    value={formData.service}
                    onChange={onChange}
                    placeholder={t('auth.adminServicePlaceholder')}
                    required
                    className={styles.input}
                />
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBriefcase /> {t('auth.adminFunction')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="admin.function"
                    value={formData.function}
                    onChange={onChange}
                    placeholder={t('auth.adminFunctionPlaceholder')}
                    required
                    className={styles.input}
                />
            </Form.Group>

            {/* Option enseignant */}
            <div className={styles.checkboxGroup}>
                <Form.Check
                    type="checkbox"
                    id="admin.hasTeacherRole"
                    checked={formData.hasTeacherRole}
                    onChange={onToggleTeacher}
                    label={t('auth.adminAlsoTeacher')}
                />
            </div>

            {formData.hasTeacherRole && (
                <div className={styles.teacherFields}>
                    <h3 className={styles.subSectionTitle}>
                        <FaBook /> {t('auth.adminTeacherSubjectsTitle')}
                    </h3>

                    <Form.Group className={styles.formGroup}>
                        <Form.Control
                            type="text"
                            id="admin.teacherRole.subjects"
                            value={formData.teacherRole.subjects}
                            onChange={onChange}
                            placeholder={t('auth.teacherSubjectsPlaceholder')}
                            className={styles.input}
                        />
                    </Form.Group>
                </div>
            )}
        </div>
    );
};

export default AdminFields;