import React from 'react';
import { FaUniversity, FaCity, FaBook, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { Row, Col, Form } from 'react-bootstrap';
import styles from './StudentFields.module.css';

const StudentFields = ({ formData, onChange }) => {
    return (
        <div className={styles.studentFields}>
            <h2 className={styles.sectionTitle}>
                <FaGraduationCap /> Étudiant
            </h2>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaUniversity /> Université <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="student.university"
                    value={formData.university}
                    onChange={onChange}
                    required
                    className={styles.select}
                >
                    <option value="">Choisissez</option>
                    <option value="iug">Institut Universitaire du Golfe (IUG)</option>
                    <option value="uy1">Université de Yaoundé I</option>
                    <option value="ud">Université de Douala</option>
                </Form.Select>
            </Form.Group>

            <Row>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaCity /> Campus <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.campus"
                            value={formData.campus}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Campus</option>
                            <option value="esg">ESG</option>
                            <option value="ista">ISTA</option>
                            <option value="isa">ISA</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaBook /> Filière <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.filiere"
                            value={formData.filiere}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Filière</option>
                            <option value="gl">Génie Logiciel</option>
                            <option value="res">Réseaux</option>
                            <option value="iia">IIA</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaGraduationCap /> Niveau <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.niveau"
                            value={formData.niveau}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Niveau</option>
                            <option value="l1">Licence 1</option>
                            <option value="l2">Licence 2</option>
                            <option value="l3">Licence 3</option>
                            <option value="m1">Master 1</option>
                            <option value="m2">Master 2</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label>
                            <FaUsers /> Groupe <span className={styles.required}>*</span>
                        </Form.Label>
                        <Form.Select
                            id="student.groupe"
                            value={formData.groupe}
                            onChange={onChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Groupe</option>
                            <option value="jours">Jours</option>
                            <option value="soirs">Soirs</option>
                            <option value="weekend">Week-end</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default StudentFields;