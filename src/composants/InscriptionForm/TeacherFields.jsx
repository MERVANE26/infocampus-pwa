import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher, FaBook, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import styles from './TeacherFields.module.css';
import TeacherUniversityMultiSelect from './TeacherUniversityMultiSelect';

const TeacherFields = ({ formData, onChange, onToggleAdmin ,universities}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.teacherFields}>
            <h2 className={styles.sectionTitle}>
                <FaChalkboardTeacher /> {t('auth.teacher')}
            </h2>

            <TeacherUniversityMultiSelect
                universities={universities}
                selected={formData.universities}
                onChange={(values) =>
                    onChange({
                        target: {
                            id: "teacher.universities",
                            value: values
                        }
                    })
                }
            />


            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBook /> {t('auth.teacherSubjects')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="teacher.subjects"
                    value={formData.subjects}
                    onChange={onChange}
                    placeholder={t('auth.teacherSubjectsPlaceholder')}
                    required
                    className={styles.input}
                />
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBriefcase /> {t('auth.teacherStatus')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="teacher.status"
                    value={formData.status}
                    onChange={onChange}
                    required
                    className={styles.select}
                >
                    <option value="permanent">{t('auth.teacherStatusPermanent')}</option>
                    <option value="vacataire">{t('auth.teacherStatusAdjunct')}</option>
                    <option value="doctorant">{t('auth.teacherStatusDoctoral')}</option>
                </Form.Select>
            </Form.Group>

            {/* Option administratif */}
            <div className={styles.checkboxGroup}>
                <Form.Check
                    type="checkbox"
                    id="teacher.hasAdminRole"
                    checked={formData.hasAdminRole}
                    onChange={onToggleAdmin}
                    label={t('auth.teacherAlsoAdmin')}
                />
            </div>

            {formData.hasAdminRole && (
                <div className={styles.adminFields}>
                    <h3 className={styles.subSectionTitle}>
                        <FaUserTie /> {t('auth.adminRoleTitle')}
                    </h3>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label>{t('auth.adminService')}</Form.Label>
                        <Form.Control
                            type="text"
                            id="teacher.adminRole.service"
                            value={formData.adminRole.service}
                            onChange={onChange}
                            placeholder={t('auth.adminServicePlaceholder')}
                            className={styles.input}
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label>{t('auth.adminFunction')}</Form.Label>
                        <Form.Control
                            type="text"
                            id="teacher.adminRole.function"
                            value={formData.adminRole.function}
                            onChange={onChange}
                            placeholder={t('auth.adminFunctionPlaceholder')}
                            className={styles.input}
                        />
                    </Form.Group>
                </div>
            )}
        </div>
    );
};

export default TeacherFields;