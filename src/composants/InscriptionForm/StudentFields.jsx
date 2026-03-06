import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUniversity, FaCity, FaBook, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { Row, Col, Form } from 'react-bootstrap';
import styles from './StudentFields.module.css';

const StudentFields = ({ formData, onChange, universities }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.studentFields}>
            <h2 className={styles.sectionTitle}>
                <FaGraduationCap /> {t('auth.student')}
            </h2>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaUniversity /> {t('auth.university')} <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="student.university"
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

            <Row>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaCity /> {t('auth.campus')} <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.campus"
                            value={formData.campus}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">{t('auth.select')}</option>
                            <option value="esg">ESG</option>
                            <option value="ista">ISTA</option>
                            <option value="isa">ISA</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaBook /> {t('auth.filiere')} <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.filiere"
                            value={formData.filiere}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">{t('auth.select')}</option>
                            <option value="gl">{t('auth.field.softwareEngineering')}</option>
                            <option value="res">{t('auth.field.networks')}</option>
                            <option value="iia">{t('auth.field.ai')}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaGraduationCap /> {t('auth.niveau')} <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.niveau"
                            value={formData.niveau}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">{t('auth.select')}</option>
                            <option value="l1">{t('auth.level.l1')}</option>
                            <option value="l2">{t('auth.level.l2')}</option>
                            <option value="l3">{t('auth.level.l3')}</option>
                            <option value="m1">{t('auth.level.m1')}</option>
                            <option value="m2">{t('auth.level.m2')}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaUsers /> {t('auth.group')} <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.groupe"
                            value={formData.groupe}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">{t('auth.select')}</option>
                            <option value="jours">{t('auth.groupOptions.day')}</option>
                            <option value="soirs">{t('auth.groupOptions.evening')}</option>
                            <option value="weekend">{t('auth.groupOptions.weekend')}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default StudentFields;